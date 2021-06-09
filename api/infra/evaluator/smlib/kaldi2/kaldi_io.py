import sys

from .io_internal.struct import matrix
from .io_internal.struct import basic
from .io_internal.struct import hmm
from .io_internal.struct import vector
from .io_internal import table
from .io_internal import utils

MatrixFloat32 = matrix.MatrixFloat32
MatrixFloat64 = matrix.MatrixFloat64
MatrixInt32 = matrix.MatrixInt32
MatrixInt64 = matrix.MatrixInt64

BasicFloat32 = basic.BasicFloat32
BasicFloat64 = basic.BasicFloat64
BasicInt32 = basic.BasicInt32
BasicInt64 = basic.BasicInt64

TransitionModel = hmm.TransitionModel

SequentialMatrixFloat32Reader = table.SequentialMatrixFloat32Reader
SequentialMatrixFloat64Reader = table.SequentialMatrixFloat64Reader
SequentialMatrixInt32Reader = table.SequentialMatrixInt32Reader
SequentialMatrixInt64Reader = table.SequentialMatrixInt64Reader

SequentialBasicFloat32Reader = table.SequentialBasicFloat32Reader
SequentialBasicFloat64Reader = table.SequentialBasicFloat64Reader
SequentialBasicInt32Reader = table.SequentialBasicInt32Reader
SequentialBasicInt64Reader = table.SequentialBasicInt64Reader

SequentialBasicVectorFloat32Reader = table.SequentialBasicVectorFloat32Reader
SequentialBasicVectorFloat64Reader = table.SequentialBasicVectorFloat64Reader
SequentialBasicVectorInt32Reader = table.SequentialBasicVectorInt32Reader
SequentialBasicVectorInt64Reader = table.SequentialBasicVectorInt64Reader

SequentialBasicPairVectorInt32Reader = table.SequentialBasicPairVectorInt32Reader

TableWriter = table.TableWriter

# Utils
classify_rspecifier = utils.classify_rspecifier
classify_wspecifier = utils.classify_wspecifier
Input = utils.Input
