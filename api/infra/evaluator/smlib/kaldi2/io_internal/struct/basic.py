import sys
import numpy as np
from struct import unpack, pack

from .struct_base import StructBase
from ..utils import read_token

__all__ = ["BasicType", "BasicFloat32", "BasicFloat64", "BasicInt32", "BasicInt64",
           "read_float32", "read_float64", "read_int32", "read_int64",
           "write_float32", "write_float64", "write_int32", "write_int64"]

class BasicType(StructBase):
    def __init__(self, dtype=np.float64):
        self._data = dtype()
        self._dtype = dtype

    def read(self, stream, binary):
        if self._dtype == np.float32:
            self._data = read_float32(stream, binary)
        elif self._dtype == np.float64:
            self._data = read_float64(stream, binary)
        elif self._dtype == np.int32:
            self._data = read_int32(stream, binary)
        elif self._dtype == np.int64:
            self._data = read_int64(stream, binary)
        else:
            raise ValueError("Unexpected dtype {}.".format(self._dtype))

    def write(self, stream, binary):
        if self._dtype == np.float32:
            write_float32(stream, binary, self._data)
        elif self._dtype == np.float64:
            write_float64(stream, binary, self._data)
        elif self._dtype == np.int32:
            write_int32(stream, binary, self._data)
        elif self._dtype == np.int64:
            write_int64(stream, binary, self._data)
        else:
            raise ValueError("Unexpected dtype {}.".format(self._dtype))

    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, v):
        if not isinstance(v, self._dtype):
            raise TypeError("Value must be {} type. Got {}.".format(self._dtype, type(v)))
        self._data = v

class BasicFloat32(BasicType):
    def __init__(self, v = None):
        super().__init__(np.float32)
        if v is not None:
            self.data = v

class BasicFloat64(BasicType):
    def __init__(self, v = None):
        super().__init__(np.float64)
        if v is not None:
            self.data = v

class BasicInt32(BasicType):
    def __init__(self, v = None):
        super().__init__(np.int32)
        if v is not None:
            self.data = v

class BasicInt64(BasicType):
    def __init__(self, v = None):
        super().__init__(np.int64)
        if v is not None:
            self.data = v

def read_float32(stream, binary):
    if binary:
        return unpack('<bf', stream.read(5))[1]
    else:
        return np.float32(read_token(stream, False))

def read_float64(stream, binary):
    if binary:
        return unpack('<bd', stream.read(9))[1]
    else:
        return np.float64(read_token(stream, False))

def read_int32(stream, binary):
    if binary:
        return unpack('<bi', stream.read(5))[1]
    else:
        return np.int32(read_token(stream, False))

def read_int64(stream, binary):
    if binary:
        return unpack('<bq', stream.read(9))[1]
    else:
        return np.int64(read_token(stream, False))

def write_float32(stream, binary, val):
    if binary:
        stream.write(pack('<bf', 4, val))
    else:
        stream.write('{} '.format(val))

def write_float64(stream, binary, val):
    if binary:
        stream.write(pack('<bd', 8, val))
    else:
        stream.write('{} '.format(val))

def write_int32(stream, binary, val):
    if binary:
        stream.write(pack('<bi', 4, val))
    else:
        stream.write('{} '.format(val))

def write_int64(stream, binary, val):
    if binary:
        stream.write(pack('<bq', 8, val))
    else:
        stream.write('{} '.format(val))
