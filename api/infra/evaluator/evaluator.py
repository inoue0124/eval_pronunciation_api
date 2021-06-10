from pydantic.main import create_model
from api.domain.entity.dtw import Dtw
from re import A
from typing import Sequence
from api.domain.entity.gop import Gop
from api.infra.evaluator.kaldi import Kaldi
from concurrent import futures
from datetime import datetime


class Evaluator:
    def compute_gop(self) -> Gop:
        text = "ある雑誌が主要29か国を対象に女性の働きやすさを評価し、ランク付けしたところ、日本は下から二番目の28位であったことがわかりました。政治家に女性が少ないなど、意思決定の場における女性の数の少なさが影響しています。また、全般的にアジアは順位が低いことから、「アジアでは女性に対して、キャリアか家庭かという選択を迫っている」と考えられます。"
        kaldi: Kaldi = Kaldi(utterance_id="U1_M1_L1", speaker_id=1)
        self.compute_posterior(kaldi=kaldi,
                               text=text,
                               speech="/api/infra/evaluator/data/test.mp3")
        kaldi.compute_alignment()
        sequence, frame_based_mean = kaldi.compute_gop()

        return Gop(sequence=sequence,
                   frame_based_mean=frame_based_mean,
                   created_at=datetime.now())

    def compute_dtw(self) -> Dtw:
        # ポステリア計算までは並行処理で行う
        with futures.ThreadPoolExecutor(max_workers=2) as executor:
            future_list = []
            kaldi: Kaldi = Kaldi(utterance_id="U1_M1_L1", speaker_id=1)
            future = executor.submit(
                self.compute_posterior,
                kaldi=kaldi,
                text="千 九百 六十 四 年 十 月",
                speech="/api/infra/evaluator/data/test.wav")
            future_list.append(future)

            kaldi: Kaldi = Kaldi(utterance_id="U1_M1_L2", speaker_id=2)
            future = executor.submit(
                self.compute_posterior,
                kaldi=kaldi,
                text="千 九百 六十 四 年 十 月",
                speech="/api/infra/evaluator/data/test.mp3")
            future_list.append(future)

            futures.as_completed(fs=future_list)

        return Dtw(
            frame_based_mean=kaldi.compute_dtw(ref_utterance_id="U1_M1_L1"),
            created_at=datetime.now())

    def compute_posterior(self, kaldi, text, speech):
        kaldi.prepare_data(text=text, speech=speech)
        kaldi.prepare_feats()
        kaldi.compute_posterior()