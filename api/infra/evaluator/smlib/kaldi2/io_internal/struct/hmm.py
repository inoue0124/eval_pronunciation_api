import sys
import numpy as np

from ..utils import read_token, write_token, expect_token
from .basic import read_int32, write_int32, read_float32
from .struct_base import StructBase
from .vector import read_vector_int32

__all__ = ["HmmTopology", "TransitionModel"]

class HmmTopology(StructBase):
    def __init__(self):
        self._phones = []
        self._phone2idx = []
        self._entries = []

    def read(self, stream, binary):
        if not binary:
            raise NotImplementedError("Text read not supported yet.")
        expect_token(stream, "<Topology>", binary)
        self._phones = read_vector_int32(stream, binary)
        self._phone2idx = read_vector_int32(stream, binary)
        size = read_int32(stream, binary)
        entries = [None] * size
        self._entries = entries
        for i in range(size):
            thist_size = read_int32(stream, binary)
            # TODO(sonicmisora): use simple dictionary instead of TopologyEntry.
            # Implement the true kaldi one later on.
            # http://kaldi-asr.org/doc/classkaldi_1_1HmmTopology.html
            entries[i] = [{} for i in range(thist_size)]
            for j in range(thist_size):
                entries[i][j]['pdf_class'] = read_int32(stream, binary)
                thiss_size = read_int32(stream, binary)
                entries[i][j]['transitions'] = [{} for i in range(thiss_size)]
                tr = entries[i][j]['transitions']
                for k in range(thiss_size):
                    tr[k]['first'] = read_int32(stream, binary)
                    tr[k]['second'] = read_float32(stream, binary)
        expect_token(stream, '</Topology>', binary)

    @property
    def phones(self):
        return self._phones

    # TODO(sonicmisora): implement some other get methods in
    # http://kaldi-asr.org/doc/classkaldi_1_1HmmTopology.html

class TransitionModel(StructBase):
    def __init__(self):
        self._topo = HmmTopology()
        self._triples = []

    def read(self, stream, binary):
        if not binary:
            raise NotImplementedError("Text read not supported yet.")
        expect_token(stream, '<TransitionModel>', binary)
        self._topo.read(stream, binary)
        expect_token(stream, '<Triples>', binary)
        size = read_int32(stream, binary)
        triples = [{} for i in range(size)]
        for i in range(size):
            # Here we simply use dictionary instead of kaldi type Triple
            triples[i]['phone'] = read_int32(stream, binary)
            triples[i]['hmm_state'] = read_int32(stream, binary)
            triples[i]['pdf'] = read_int32(stream, binary)
        self._triples = triples
        expect_token(stream, "</Triples>", binary);

        # TODO(sonicmisora): add ComputeDerived here otherwise some data read cannot be used

        # TODO(sonicmisora): Read log prob
        print("Warning: skip the log prob part.", file=sys.stderr)

    @property
    def triples(self):
        return self._triples
