import sys
import numpy as np
from struct import pack

from . import iobase as io

def write_token(file, binary, token):
    """Write a string until space, tab or newline is reached."""
    if binary:
        file.write((token + ' ').encode())
    else:
        file.write('{} '.format(token))

def write_float32(file, binary, val):
    if binary:
        file.write(pack('<bf', 4, val))
    else:
        file.write('{} '.format(val))

def write_float64(file, binary, val):
    if binary:
        file.write(pack('<bd', 8, val))
    else:
        file.write('{} '.format(val))

def write_int32(file, binary, val):
    if binary:
        file.write(pack('<bi', 4, val))
    else:
        file.write('{} '.format(val))

def write_int64(file, binary, val):
    if binary:
        file.write(pack('<bq', 8, val))
    else:
        file.write('{} '.format(val))

def write_file_begin(file, binary):
    if binary:
        file.write(b'\x00B')

def write_file_end(file, binary):
    if not binary:
        file.write('\n')
