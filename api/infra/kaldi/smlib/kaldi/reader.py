import sys
import numpy as np
from struct import unpack

from . import iobase as io

__all__ = []

def skip_white(file):
    while True:
        c = io.peek(file)
        if c == b' ' or c == b'\t' or c == b'\n' or c == b'\r':
            file.read(1)
        else:
            return

def read_token(file, binary):
    """Read a string until space, tab or newline is reached."""
    if not binary:
        skip_white(file)
    ret = bytearray()
    while True:
        c = file.read(1)
        if c == b"":
            raise ValueError("Unexpected file end.")
        if c != b' ' and c != b'\t' and c != b'\n':
            ret.append(c[0])
        else:
            break
    if binary:
        return bytes(ret)
    else:
        return bytes(ret).decode()

def expect_token(file, token, binary):
    """Expect a string token. If not, raise an error."""
    real_token = read_token(file, binary)
    if binary:
        real_token = real_token.decode()
    if real_token != token:
        raise ValueError("Token {} cannot be found.".format(token))
    return real_token

def read_float32(file, binary):
    if binary:
        return unpack('<bf', file.read(5))[1]
    else:
        return np.float32(read_token(file, False))

def read_float64(file, binary):
    if binary:
        return unpack('<bd', file.read(9))[1]
    return NotImplementedError('Not supported.')

def read_int32(file, binary):
    if binary:
        return unpack('<bi', file.read(5))[1]
    return NotImplementedError('Not supported.')

def read_int64(file, binary):
    if binary:
        return unpack('<bq', file.read(9))[1]
    return NotImplementedError('Not supported.')

def read_vector_integer(file, binary, int_size = -1):
    """If int size is negative, use the size in file (4 or 8). Otherwise do the check."""
    if not binary:
        return NotImplementedError('Not supported.')
    file_int_size = file.read(1)[0]
    if int_size < 0:
        int_size = file_int_size
    elif int_size != file_int_size:
        raise ValueError("File vector element size {} and given int size {} not match. \
                         Maybe you want to set int_size = -1 to automatically detect this??".
                         format(file_int_size, int_size))
    vector_size = unpack('<i', file.read(4))[0]
    assert(vector_size >= 0)
    data_type = np.int32 if int_size == 4 else np.int64
    if vector_size > 0:
        buffered = file.read(vector_size * int_size)
        ret = np.frombuffer(buffered, dtype=data_type)
    else:
        ret = np.zeros((0), dtype=data_type)
    return ret

def read_wrapped_matrix(file):
    """Read matrix from filestream."""
    is_binary = io.is_binary(file)
    # TODO(sonicmisora): add text mode reading
    if not is_binary:
        raise NotImplementedError('Currently only binary ark is supported.')
    type_des = read_token(file, is_binary)
    if not(len(type_des) == 2 and (type_des == b'FM' or type_des == b'DM')):
        raise ValueError('Wrong file type.')
    rows = read_int32(file, is_binary)
    cols = read_int32(file, is_binary)
    if type_des[0] == b'F'[0]:
        data_type = np.float32
    else:
        data_type = np.float64
    buffered = file.read(rows * cols * np.dtype(data_type).itemsize)
    ret = np.frombuffer(buffered, dtype=data_type).reshape(rows, cols)
    return ret

def read_wrapped_vector_int32(file):
    is_binary = io.is_binary(file)
    # TODO(sonicmisora): add text mode reading
    if not is_binary:
        raise NotImplementedError('Currently only binary ark is supported.')
    size = read_int32(file, is_binary)
    ret = np.zeros((size), dtype=np.int32)
    for i in range(size):
        ret[i] = read_int32(file, is_binary)
    return ret

def read_hmm_topology(file, binary):
    if not binary:
        return NotImplementedError('Not supported.')
    expect_token(file, "<Topology>", binary)
    ret = {}
    ret["phones"] = read_vector_integer(file, binary)
    ret["phone2idx"] = read_vector_integer(file, binary)
    size = read_int32(file, binary)
    entries = [None] * size
    ret["entries"] = entries
    for i in range(size):
        thist_size = read_int32(file, binary)
        entries[i] = [{} for i in range(thist_size)]
        for j in range(thist_size):
            entries[i][j]['pdf_class'] = read_int32(file, binary)
            thiss_size = read_int32(file, binary)
            entries[i][j]['transitions'] = [{} for i in range(thiss_size)]
            tr = entries[i][j]['transitions']
            for k in range(thiss_size):
                tr[k]['first'] = read_int32(file, binary)
                tr[k]['second'] = read_float32(file, binary)
    expect_token(file, '</Topology>', binary)
    return ret


def read_wrapped_transition_model(file):
    is_binary = io.is_binary(file)
    # TODO(sonicmisora): add text mode reading
    if not is_binary:
        raise NotImplementedError('Currently only binary file is supported. Please convert it into binary using gmm-copy.')
    ret = {}
    expect_token(file, '<TransitionModel>', is_binary)
    # print("Warning: We just skip the topo model and go for the <Triples> part now.", file=sys.stderr)
    ret['topo'] = read_hmm_topology(file, is_binary)
    expect_token(file, '<Triples>', is_binary)
    size = read_int32(file, is_binary)
    triples = [{} for i in range(size)]
    for i in range(size):
        triples[i]['phone'] = read_int32(file, is_binary)
        triples[i]['hmm_state'] = read_int32(file, is_binary)
        triples[i]['pdf'] = read_int32(file, is_binary)
    ret['triples'] = triples

    # TODO(sonicmisora): Read log prob
    print("Warning: We just skip the log prob part.", file=sys.stderr)
    return ret


if __name__ == '__main__':
    ist = io.open(sys.argv[1], 'r')
    mat = read_matrix(ist)
    print(mat)
