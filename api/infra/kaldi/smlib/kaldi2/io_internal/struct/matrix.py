import sys
import numpy as np

from ..utils import read_token, write_token
from .basic import read_int32, write_int32
from .struct_base import StructBase

__all__ = ["Matrix", "MatrixFloat32", "MatrixFloat64", "MatrixInt32", "MatrixInt64"]

class Matrix(StructBase):
    def __init__(self, dtype=np.float64):
        self._data = np.empty((0, 0), dtype=dtype)
        self._dtype = dtype

    def check_type_description(self, type_des):
        if len(type_des) != 2:
            return False
        if type_des == 'FM' or type_des == 'DM':
            if type_des[0] == 'F' and self._dtype != np.float32:
                return False
            if type_des[0] == 'D' and self._dtype != np.float64:
                return False
            return True
        return True

    def get_type_description(self):
        if self._dtype == np.float32:
            return 'FM'
        if self._dtype == np.float64:
            return 'DM'
        # TODO(sonicmisora): find proper description for int32 and int64
        return 'FM'

    def read(self, stream, binary):
        if not binary:
            raise NotImplementedError('Text read mode not supported yet.')
        type_des = read_token(stream, binary)
        if not self.check_type_description(type_des):
            raise TypeError("Type description {} and Matrix type {} dismatches.".format(type_des, self._dtype))
        rows = read_int32(stream, binary)
        cols = read_int32(stream, binary)
        buffered = stream.read(rows * cols * self._dtype().itemsize)
        self._data = np.frombuffer(buffered, dtype=self._dtype).reshape(rows, cols)

    def write(self, stream, binary):
        if binary:
            # Binary mode
            type_des = self.get_type_description()
            write_token(stream, binary, type_des)
            # Write row and col
            write_int32(stream, binary, self._data.shape[0])
            write_int32(stream, binary, self._data.shape[1])
            # Write binary using built-in numpy functions
            self._data.tofile(stream)
        else:
            # Text mode
            if len(self._data) == 0:
                stream.write(" [ ]\n")
            else:
                stream.write(" [")
                for i in range(self._data.shape[0]):
                    stream.write("\n  ")
                    for j in range(self._data.shape[1]):
                        stream.write("{} ".format(self._data[i][j]))
                stream.write("]\n")

    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, v):
        if not isinstance(v, np.ndarray):
            raise TypeError("Numpy ndarray expected. Get {}.".format(type(v)))
        if v.dtype != self._dtype:
            raise TypeError("Value matrix must be {} type. Got {}.".format(self._dtype, v.dtype))
        self._data = v

class MatrixFloat32(Matrix):
    def __init__(self, v=None):
        super().__init__(np.float32)
        if v is not None:
            self.data = v

class MatrixFloat64(Matrix):
    def __init__(self, v=None):
        super().__init__(np.float64)
        if v is not None:
            self.data = v

class MatrixInt32(Matrix):
    def __init__(self, v=None):
        super().__init__(np.int32)
        if v is not None:
            self.data = v

class MatrixInt64(Matrix):
    def __init__(self, v=None):
        super().__init__(np.int64)
        if v is not None:
            self.data = v
