from . import iobase as io
from . import reader

class SequentialTableReader:
    """Class to read tables sequentially (Without random access to keys)."""
    def __init__(self, rxfilename=None):
        if rxfilename:
            self.open(rxfilename)
        else:
            self._file = None

    def open(self, rxfilename):
        self._file = io.open_read_nontable(rxfilename)
        #self.next()

    def done(self):
        """If at the end of file."""
        if self._file == None:
            return True
        if io.is_eof(self._file):
            return True
        reader.skip_white(self._file)
        return io.is_eof(self._file)

    def __next__(self):
        """Suppose current stream is at next key."""
        if self._file == None:
            raise ValueError("No file opened!")
        if self.done():
            raise StopIteration()
        self._key = reader.read_token(self.file, False)
        return self.key, self.file

    def next(self):
        return self.__next__()

    def __iter__(self):
        return self

    def __enter__(self):
        if self.file == None:
            raise ValueError("File is not opened yet.")
        return self

    def __exit__(self, exception_type, exception_value, traceback):
        self.close()

    @property
    def file(self):
        return self._file

    @property
    def key(self):
        return self._key

    def close(self):
        if self._file != None:
            self._file.close()

class TableWriter:
    """Class to write tables."""
    def __init__(self, wxfilename=None):
        if wxfilename:
            self.open(wxfilename)
        else:
            self._file = None
            self._binary = True

    def open(self, wxfilename):
        self._file = io.open_write_nontable(wxfilename)
        f = io.parse_filename(wxfilename, False)
        self._binary = 't' not in f['options']

    def __enter__(self):
        if self.file == None:
            raise ValueError("File is not opened yet.")
        return self

    def __exit__(self, exception_type, exception_value, traceback):
        self.close()

    def close(self):
        if self._file != None:
            self._file.close()
            self._file = None
            self._binary = True

    @property
    def file(self):
        return self._file

    @property
    def binary(self):
        return self._binary

    def write(self, key):
        """Write a token key and return current file stream"""
        if self._file == None:
            raise ValueError("File is not opened yet.")
        if self._binary:
            self._file.write((key + ' ').encode())
        else:
            self._file.write(key + ' ')
        return self.file
