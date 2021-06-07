import sys

from .utils import is_eof, skip_white, read_token, open_read_stream, open_write_stream, parse_specifier
from .holder import Holder
from . import holder

class SequentialTableReader:
    """A table reader which reads data sequentially(which doesn't put visited data in memory)."""

    def __init__(self, holder_type, rspecifier=None):
        self._holder = holder_type()
        self._holder_type = holder_type
        self._stream = None
        if rspecifier:
            self.open(rspecifier)

    def open(self, rspecifier):
        self._stream = open_read_stream(rspecifier)

    def done(self):
        """Whether all data has been read."""
        if not self._stream:
            return True
        if is_eof(self._stream):
            return True
        skip_white(self._stream)
        return is_eof(self._stream)

    def __next__(self):
        """Suppose current stream is at next key."""
        if not self._stream:
            raise ValueError("Stream is not opened.")
        if self.done():
            raise StopIteration()
        # Read token in text mode simply because it can cover both binary and text mode
        self._key = read_token(self._stream, False)
        self._holder.read(self._stream)
        return self._key, self._holder.value

    def next(self):
        return self.__next__()

    def __iter__(self):
        return self

    def __enter__(self):
        if not self._stream:
            raise ValueError("Stream is not opened.")
        return self

    def __exit__(self, exception_type, exception_value, traceback):
        self.close()

    @property
    def value(self):
        return self._holder.value

    @property
    def key(self):
        return self._key

    def close(self):
        if self._stream:
            self._stream.close()
            self._stream = None

class TableWriter:
    """A table writer which writes key and value."""

    def __init__(self, wspecifier=None):
        self._stream = None
        self._binary = True
        if wspecifier:
            self.open(wspecifier)

    def open(self, wspecifier):
        self._stream, self._binary = open_write_stream(wspecifier)

    def __enter__(self):
        if not self._stream:
            raise ValueError("Stream is not opened.")
        return self

    def __exit__(self, exception_type, exception_value, traceback):
        self.close()

    def close(self):
        if self._stream:
            self._stream.close()
            self._stream = None
            self._binary = True

    def write(self, key, data):
        """
        Write data struct with key.
        Notice data struct should be without holder. e.g.
        You should give MatrixFloat64 as parameter instead of MatrixFloat64Holder.
        """
        if not self._stream:
            raise ValueError("Stream is not opened.")
        if self._binary:
            self._stream.write((key + ' ').encode())
        else:
            self._stream.write(key + ' ')
        Holder.write(self._stream, data, self._binary)
        if not self._binary:
            # Add new line for better visualization
            self._stream.write('\n')

### Table readers
class SequentialMatrixFloat32Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.MatrixFloat32Holder, rspecifier)

class SequentialMatrixFloat64Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.MatrixFloat64Holder, rspecifier)

class SequentialMatrixInt32Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.MatrixInt32Holder, rspecifier)

class SequentialMatrixInt64Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.MatrixInt64Holder, rspecifier)


class SequentialBasicFloat32Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicFloat32Holder, rspecifier)

class SequentialBasicFloat64Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicFloat64Holder, rspecifier)

class SequentialBasicInt32Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicInt32Holder, rspecifier)

class SequentialBasicInt64Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicInt64Holder, rspecifier)


class SequentialBasicVectorFloat32Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicVectorFloat32Holder, rspecifier)

class SequentialBasicVectorFloat64Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicVectorFloat64Holder, rspecifier)

class SequentialBasicVectorInt32Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicVectorInt32Holder, rspecifier)

class SequentialBasicVectorInt64Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicVectorInt64Holder, rspecifier)


class SequentialBasicPairVectorInt32Reader(SequentialTableReader):
    def __init__(self, rspecifier=None):
        super().__init__(holder.BasicPairVectorInt32Holder, rspecifier)
