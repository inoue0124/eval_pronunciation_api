import sys

from .utils import test_stream_binary
from .struct.matrix import *
from .struct.basic import *
from .struct.vector import *
from .struct.hmm import *

__all__ = ["Holder", "MatrixFloat32Holder", "MatrixFloat64Holder"]

class Holder:
    def __init__(self, struct_type):
        self._data = struct_type()
        self._struct_type = struct_type

    def read(self, stream):
        binary = test_stream_binary(stream)
        self._data.read(stream, binary)

    @staticmethod
    def write(stream, data_struct, binary):
        if binary:
            stream.write(b'\x00B')
        # Do nothing in text mode
        data_struct.write(stream, binary)

    @property
    def value(self):
        """Return wrapped data."""
        return self._data

#### Matrix holders
class MatrixFloat32Holder(Holder):
    def __init__(self):
        super().__init__(MatrixFloat32)

class MatrixFloat64Holder(Holder):
    def __init__(self):
        super().__init__(MatrixFloat64)

class MatrixInt32Holder(Holder):
    def __init__(self):
        super().__init__(MatrixInt32)

class MatrixInt64Holder(Holder):
    def __init__(self):
        super().__init__(MatrixInt64)

#### BasicVector holders
class BasicVectorFloat32Holder(Holder):
    def __init__(self):
        super().__init__(BasicVectorFloat32)

class BasicVectorFloat64Holder(Holder):
    def __init__(self):
        super().__init__(BasicVectorFloat64)

class BasicVectorInt32Holder(Holder):
    def __init__(self):
        super().__init__(BasicVectorInt32)

class BasicVectorInt64Holder(Holder):
    def __init__(self):
        super().__init__(BasicVectorInt64)

#### BasicPairVector holders
class BasicPairVectorInt32Holder(Holder):
    def __init__(self):
        super().__init__(BasicPairVectorInt32)

#### BasicType holders
class BasicFloat32Holder(Holder):
    def __init__(self):
        super().__init__(BasicFloat32)

class BasicFloat64Holder(Holder):
    def __init__(self):
        super().__init__(BasicFloat64)

class BasicInt32Holder(Holder):
    def __init__(self):
        super().__init__(BasicInt32)

class BasicInt64Holder(Holder):
    def __init__(self):
        super().__init__(BasicInt64)

# TODO(sonicmisora): add other holders...
