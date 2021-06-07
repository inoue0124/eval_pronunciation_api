from .kaldi.kaldi import Kaldi


class Evaluator:
    def compute_gop(self) -> float:
        kaldi: Kaldi = Kaldi(utterance_id="U1_M1_L1", learner_id=1)
        kaldi.prepare_data(text="千 九百 六十 四 年 十 月")
        kaldi.prepare_feats()
        kaldi.compute_posterior()
        kaldi.compute_alignment()
        return kaldi.compute_gop()

    def compute_dtw(self) -> None:
        return