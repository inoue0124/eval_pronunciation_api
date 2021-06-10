import sys
import numpy as np
from struct import unpack

from ..utils import read_token
from .basic import read_int32, read_int64, read_float32, read_float64
from .struct_base import StructBase

__all__ = ["VectorFloat32", "VectorFloat64", "VectorInt32", "VectorInt64",
           "BasicVectorFloat32", "BasicVectorFloat64", "BasicVectorInt32", "BasicVectorInt64",
           "BasicPairVectorInt32",
           "read_vector_float32", "read_vector_float64", "read_vector_int32", "read_vector_int64"]

class Vector(StructBase):
    """
    Compact form of vector. e.g.
    [element-size](1) [vector-size](4) [content](e-size * v-size)
    """
    def __init__(self, dtype=np.float64):
        self._data = np.empty((0), dtype=dtype)
        self._dtype = dtype

    def check_element_size(self, size):
        return self._dtype().itemsize == size

    def read(self, stream, binary):
        if not binary:
            raise NotImplementedError('Text read not supported yet.')
        element_size = stream.read(1)[0]
        if not self.check_element_size(element_size):
            raise TypeError("Stream element size {} and dtype {} dismatches.".format(element_size, self._dtype))
        vector_size = unpack('<i', stream.read(4))[0]
        assert(vector_size >= 0)
        if vector_size > 0:
            buffered = stream.read(vector_size * element_size)
            self._data = np.frombuffer(buffered, dtype=self._dtype)
        else:
            self._data = np.empty((0), dtype=self._dtype)

class BasicVector(StructBase):
    """
    Vector with each element in basic type. e.g.
    [vector-size](4 + 1) [basic-type content]((e-size + 1) * v-size)
    """
    def __init__(self, dtype=np.float64):
        self._data = np.empty((0), dtype=dtype)
        self._dtype = dtype

    def read(self, stream, binary):
        if not binary:
            raise NotImplementedError('Text read not supported yet.')
        vector_size = read_int32(stream, binary)
        assert(vector_size >= 0)
        if vector_size > 0:
            self._data = np.empty((vector_size), dtype=self._dtype)
            if self._dtype == np.float32:
                read_func = read_float32
            elif self._dtype == np.float64:
                read_func = read_float64
            elif self._dtype == np.int32:
                read_func = read_int32
            elif self._dtype == np.int64:
                read_func = read_int64
            else:
                raise TypeError("Unknown dtype {}.".format(dtype))
            for i in range(vector_size):
                self._data[i] = read_func(stream, binary)
        else:
            self._data = np.empty((0), dtype=self._dtype)

class BasicPairVector(StructBase):
    """
    Vector with basic element pair. e.g.
    [vector-size](4 + 1) [basic-pair-type content]((e-size + 1) * 2 * v-size)
    """
    def __init__(self, dtype=np.float64):
        self._data = np.empty((0, 0), dtype=dtype)
        self._dtype = dtype

    def read(self, stream, binary):
        if not binary:
            raise NotImplementedError('Text read not supported yet.')
        vector_size = read_int32(stream, binary)
        assert(vector_size >= 0)
        if vector_size > 0:
            self._data = np.empty((vector_size, 2), dtype=self._dtype)
            if self._dtype == np.float32:
                read_func = read_float32
            elif self._dtype == np.float64:
                read_func = read_float64
            elif self._dtype == np.int32:
                read_func = read_int32
            elif self._dtype == np.int64:
                read_func = read_int64
            else:
                raise TypeError("Unknown dtype {}.".format(dtype))
            for i in range(vector_size):
                self._data[i][0] = read_func(stream, binary)
                self._data[i][1] = read_func(stream, binary)
        else:
            self._data = np.empty((0, 0), dtype=self._dtype)

### Vector def
class VectorFloat32(Vector):
    def __init__(self):
        super().__init__(np.float32)

class VectorFloat64(Vector):
    def __init__(self):
        super().__init__(np.float64)

class VectorInt32(Vector):
    def __init__(self):
        super().__init__(np.int32)

class VectorInt64(Vector):
    def __init__(self):
        super().__init__(np.int64)

### BasicVector def
class BasicVectorFloat32(BasicVector):
    def __init__(self):
        super().__init__(np.float32)

class BasicVectorFloat64(BasicVector):
    def __init__(self):
        super().__init__(np.float64)

class BasicVectorInt32(BasicVector):
    def __init__(self):
        super().__init__(np.int32)

class BasicVectorInt64(BasicVector):
    def __init__(self):
        super().__init__(np.int64)

### BasicPairVector def
class BasicPairVectorInt32(BasicPairVector):
    def __init__(self):
        super().__init__(np.int32)

### Read functions
def read_vector_float32(stream, binary):
    v = Vector(np.float32)
    v.read(stream, binary)
    return v.data

def read_vector_float64(stream, binary):
    v = Vector(np.float64)
    v.read(stream, binary)
    return v.data

def read_vector_int32(stream, binary):
    v = Vector(np.int32)
    v.read(stream, binary)
    return v.data

def read_vector_int64(stream, binary):
    v = Vector(np.int64)
    v.read(stream, binary)
    return v.data
