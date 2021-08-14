from api.domain.entity.dtw import Dtw
from re import A
from api.domain.entity.gop import Gop
from api.infra.evaluator.kaldi import Kaldi
from concurrent import futures
from datetime import datetime
import uuid


class Evaluator:
    def compute_gop(self, text: str, speech_path: str) -> Gop:
        utterance_id: str = speech_path.split('.')[0]
        kaldi: Kaldi = Kaldi(utterance_id=utterance_id)
        self.compute_posterior(kaldi=kaldi,
                               text=text,
                               speech=speech_path)
        kaldi.compute_alignment()
        try:
            sequence, frame_based_mean = kaldi.compute_gop()
        except Exception as e:
            raise e

        return Gop(sequence=sequence,
                   frame_based_mean=frame_based_mean,
                   created_at=datetime.now())

    def compute_dtw(self, ref_speech_path: str, speech_path: str) -> Dtw:
        ref_utterance_id: str = ref_speech_path.split('.')[0]
        utterance_id: str = speech_path.split('.')[0]
        # ポステリア計算までは並行処理で行う
        with futures.ThreadPoolExecutor(max_workers=2) as executor:
            future_list = []
            kaldi: Kaldi = Kaldi(utterance_id=ref_utterance_id)
            future = executor.submit(
                self.compute_posterior,
                kaldi=kaldi,
                text="",
                speech=ref_speech_path)
            future_list.append(future)

            kaldi: Kaldi = Kaldi(utterance_id=utterance_id)
            future = executor.submit(
                self.compute_posterior,
                kaldi=kaldi,
                text="",
                speech=speech_path)
            future_list.append(future)

            futures.as_completed(fs=future_list)

        return Dtw(
            frame_based_mean=kaldi.compute_dtw(ref_utterance_id=ref_utterance_id),
            created_at=datetime.now())

    def compute_posterior(self, kaldi, text, speech):
        kaldi.prepare_data(text=text, speech=speech)
        kaldi.prepare_feats()
        kaldi.compute_posterior()