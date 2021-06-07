import sys

class StructBase:
    def read(self, stream, binary):
        raise NotImplementedError("Not supported yet.")

    def write(self, stream, binary):
        raise NotImplementedError("Not supported yet.")

    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, v):
        self._data = v
