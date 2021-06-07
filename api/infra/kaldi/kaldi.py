from typing import Optional
import MeCab
import os
import subprocess
from .smlib.kaldi import iobase, reader, writer
import numpy as np


class Kaldi:
    def __init__(self, utterance_id: str, learner_id: int):
        self.utterance_id = utterance_id
        self.learner_id = learner_id
        self.data_dir = f"/tmp/{utterance_id}/data"
        self.feats_dir = f"/tmp/{utterance_id}/feats"
        self.model_dir = "/api/infra/kaldi/model"
        self.score_dir = f"/tmp/{utterance_id}/scores"
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.feats_dir, exist_ok=True)
        os.makedirs(self.score_dir, exist_ok=True)

    def softmax(self, x):
        e_x = np.exp(x - x.max(axis=1).reshape(len(x), 1))
        return e_x / e_x.sum(axis=1).reshape(len(x), 1)

    def prepare_data(self, text: str):
        # text
        mecab = MeCab.Tagger("-Owakati")
        with open(f"{self.data_dir}/text", 'w', encoding='UTF-8') as f:
            f.write(f"{self.utterance_id} {mecab.parse(text)}\n")

        # wav.scp
        with open(f"{self.data_dir}/wav.scp", 'w', encoding='UTF-8') as f:
            f.write(
                f"{self.utterance_id} sox /api/infra/kaldi/data/test.wav -r 16000 -t wav - |\n"
            )

        # utt2spk
        with open(f"{self.data_dir}/utt2spk", 'w', encoding='UTF-8') as f:
            f.write(f"{self.utterance_id} {self.learner_id}\n")

        # spk2utt
        with open(f"{self.data_dir}/spk2utt", 'w', encoding='UTF-8') as f:
            f.write(f"{self.learner_id} {self.utterance_id}\n")

    def prepare_feats(self) -> Optional[Exception]:
        # mfcc
        cmd: str = f"compute-mfcc-feats --use-energy=false --sample-frequency=16000 scp,p:{self.data_dir}/wav.scp ark:{self.feats_dir}/mfcc.ark"
        result: subprocess.CompletedProcess = subprocess.run(cmd, shell=True)
        try:
            result.check_returncode()
        except subprocess.CalledProcessError as e:
            return e

        # cmvn
        cmd: str = "copy-feats ark:/tmp/U1_M1_L1/feats/mfcc.ark ark:- |"  # read mfcc feats
        cmd += f"compute-cmvn-stats --spk2utt=ark:{self.data_dir}/spk2utt ark:- ark:{self.feats_dir}/cmvn.ark"  # compute cmvn from mfcc
        result: subprocess.CompletedProcess = subprocess.run(cmd, shell=True)
        try:
            result.check_returncode()
        except subprocess.CalledProcessError as e:
            return e

        # dnn_feats
        mfcc_feats: str = f"ark:copy-feats ark:{self.feats_dir}/mfcc.ark ark:- |"  # read mfcc feats
        cmvn_feats: str = f"ark:copy-feats ark:{self.feats_dir}/cmvn.ark ark:- |"  # read cmvn feats
        cmd: str = f"apply-cmvn --utt2spk=ark:{self.data_dir}/utt2spk '{cmvn_feats}' '{mfcc_feats}' ark,t:- |"  # apply cmvn
        cmd += "splice-feats ark:- ark:- |"  # splice
        cmd += f"transform-feats {self.model_dir}/gmm/final.mat ark:- ark:{self.feats_dir}/dnn_feats.ark"  # transform by gmm final model
        # cmd += f"transform-feats {self.model_dir}/gmm/final.mat ark:- ark:- |"  # transform by gmm final model
        # cmd += f"transform-feats --utt2spk=ark:{self.data_dir}/utt2spk ark:{self.model_dir}/gmm/trans.1 ark:- ark:{self.feats_dir}/dnn_feats.ark"  # tranceform by speaker adapted model
        result: subprocess.CompletedProcess = subprocess.run(cmd, shell=True)
        try:
            result.check_returncode()
        except subprocess.CalledProcessError as e:
            return e

    def compute_posterior(self):
        dnn_feats: str = f"ark:copy-feats ark:{self.feats_dir}/dnn_feats.ark ark:- |"
        cmd: str = f"nnet-forward --no-softmax=true --prior-scale=1.0 --feature-transform={self.model_dir}/dnn/final.feature_transform --class-frame-counts={self.model_dir}/dnn/prior_counts {self.model_dir}/dnn/final.nnet '{dnn_feats}' ark:{self.feats_dir}/posterior.ark"
        result: subprocess.CompletedProcess = subprocess.run(cmd, shell=True)
        try:
            result.check_returncode()
        except subprocess.CalledProcessError as e:
            return e

    def compute_alignment(self):
        posterior: str = f"ark:copy-feats ark:{self.feats_dir}/posterior.ark ark:- |"
        transcription: str = f"ark:perl /api/util/sym2int.pl --map-oov 2 -f 2- {self.model_dir}/lang/words_no_class.txt {self.data_dir}/text |"
        cmd: str = f"compile-train-graphs --read-disambig-syms={self.model_dir}/lang/disambig.int {self.model_dir}/dnn/tree {self.model_dir}/dnn/final.mdl {self.model_dir}/lang/L.fst '{transcription}' ark:- |"
        cmd += f"align-compiled-mapped --transition-scale=1.0 --acoustic-scale=0.1 --self-loop-scale=0.1 --beam=10 --retry-beam=40 {self.model_dir}/dnn/final.mdl ark:- '{posterior}' ark:{self.feats_dir}/alignment.ark"
        result: subprocess.CompletedProcess = subprocess.run(cmd, shell=True)
        try:
            result.check_returncode()
        except subprocess.CalledProcessError as e:
            return e

    def compute_gop(self) -> float:
        # 無音の音素リストをnsil_setに設定
        with open(f"{self.model_dir}/lang/nonsilence.int", 'r') as f:
            nsil_set = {}
            for line in f:
                phone_int = int(line.strip())
                nsil_set[phone_int] = True

        # 音素とpdfの変換辞書を作成
        with iobase.open(f"{self.model_dir}/gmm/final.mdl", 'r') as model_file:
            model = reader.read_wrapped_transition_model(model_file)
            phone2pdfs = {}
            for t in model['triples']:
                phone = t['phone']
                pdf = t['pdf']
                if phone not in nsil_set:
                    continue
                if phone not in phone2pdfs:
                    phone2pdfs[phone] = {}
                phone2pdfs[phone][pdf] = True

        # GOP計算
        with iobase.open(f"ark,t:{self.score_dir}/gop.ark", 'w') as gop_table:
            with iobase.open(f"ark:{self.feats_dir}/posterior.ark",
                             'r') as post_table:
                with iobase.open(
                        f"ark: ali-to-phones --per-frame {self.model_dir}/dnn/final.mdl ark:{self.feats_dir}/alignment.ark ark:-|",
                        'r') as ali_table:
                    for ali_key, ali_fs in ali_table:
                        ali = reader.read_wrapped_vector_int32(ali_fs)

                        while True:
                            post_key, post_fs = post_table.next()
                            post = reader.read_wrapped_matrix(post_fs)
                            if post_key != ali_key:
                                print("Post_key skipped:{}".format(post_key))
                            else:
                                break

                        if len(ali) != len(post):
                            raise ValueError(
                                'For key {}, aligment frames({}) != post frames({})'
                                .format(ali_key, len(ali), len(post)))

                        post = self.softmax(post)
                        total = 0
                        cnt = 0
                        for post_frame, phone in zip(post, ali):
                            if phone not in nsil_set:
                                continue
                            s = 0
                            for pdf in phone2pdfs[phone].keys():
                                s += post_frame[pdf]
                            total += s
                            cnt += 1

                        return total / cnt
                        # gop_fs = gop_table.write(ali_key)
                        # writer.write_file_begin(gop_fs, gop_table.binary)
                        # writer.write_float32(gop_fs, gop_table.binary,
                        #                      total / cnt)
                        # writer.write_file_end(gop_fs, gop_table.binary)