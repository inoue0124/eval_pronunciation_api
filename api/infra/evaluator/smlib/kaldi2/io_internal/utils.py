import sys
from . import expipes

PIPE_FILE = 'file'
PIPE_PIPE = 'pipe'
PIPE_STD = 'std'
BLANK = 'blank'
TABLE = 'table'
NONTABLE = 'nontable'

__all__ = ["test_stream_binary", "read_token", "write_token", "skip_white", "peek", "is_eof",
           "classify_rspecifier", "classify_wspecifier", "Input"]

def test_stream_binary(stream):
    """Test if stream is binary format. Note that this function may read several header bytes of the stream."""
    if peek(stream) == b'\x00':
        # Looks like a binary file, consume '\x00'
        stream.read(1)
        if peek(stream) != b'B':
            raise TypeError('File looks like binary but without a following "B". Probably broken.')
        # Consume 'B'
        stream.read(1)
        return True
    else:
        # Must be text file
        return False

def read_token(stream, binary):
    """Read a string until space, tab or newline is reached."""
    if not binary:
        skip_white(stream)
    ret = bytearray()
    while True:
        c = stream.read(1)
        if c == b"":
            raise ValueError("Unexpected file end.")
        if c != b' ' and c != b'\t' and c != b'\n':
            ret.append(c[0])
        else:
            break
    # Always return string instead of bytes
    return bytes(ret).decode()

def expect_token(stream, token, binary):
    """Expect a string token. If not, raise an error."""
    real_token = read_token(stream, binary)
    if real_token != token:
        raise ValueError("Token {} cannot be found.".format(token))
    return real_token

def write_token(stream, binary, token):
    """Write a string token with an appending space."""
    if binary:
        stream.write((token + ' ').encode())
    else:
        stream.write('{} '.format(token))

def skip_white(stream):
    """Skip space, tab, line ends for a stream in binary mode."""
    while True:
        c = peek(stream)
        if c == b' ' or c == b'\t' or c == b'\n' or c == b'\r':
            stream.read(1)
        else:
            return

def peek(stream):
    """Peek the next char of filestream."""
    return stream.peek(1)[:1]

def is_eof(stream):
    """Whether stream reached its end."""
    return len(peek(stream)) == 0

### Stream

def classify_rspecifier(rspecifier):
    return classify_specifier(rspecifier, 'r')

def classify_wspecifier(wspecifier):
    return classify_specifier(wspecifier, 'w')

def classify_specifier(specifier, mode):
    if mode != 'r' and mode != 'w':
        raise ValueError("Mode can only be 'r' or 'w'.")
    parse_ret = parse_specifier(specifier, mode)
    return parse_ret['wrapper_type']

std_open = open

def open(specifier, mode):
    if mode == 'r':
        return open_read_stream(specifier)
    if mode == 'w':
        return open_write_stream(specifier)
    raise ValueError('Mode must be \'r\' or \'w\', not %r.' % (mode))

def open_read_stream(rspecifier):
    """
    Open a read stream described by a rspecifier.
    Returned stream is always in binary mode because text mode cannot handle non-displayable characters.
    """
    parse_ret = parse_specifier(rspecifier, 'r')
    if parse_ret['wrapper_type'] == BLANK:
        raise ValueError('Null rspecifier is not allowed.')
    if parse_ret['pipe_type'] == PIPE_STD:
        t = expipes.Template()
        t.prepend('cat', '.-')
        return t.open('', 'rb')
    elif parse_ret['pipe_type'] == PIPE_FILE:
        return std_open(parse_ret["filename"], 'rb')
    else:
        # PIPE
        t = expipes.Template()
        if len(parse_ret['filename']) == 0:
            raise ValueError('Invalid rspecifier.')
        t.prepend(parse_ret['filename'][0], '.-')
        for pipe_seg in parse_ret['filename'][1:]:
            t.append(pipe_seg, '--')
        return t.open('', 'rb')

def open_write_stream(wspecifier):
    """
    Open a write stream described by a wspecifier.
    Returned stream's binarity depends on the options in wspecifier. e.g.
    'ark,t' for text mode, and 'ark' for binary mode.
    Notice that there is another return which indicates which this is binary.
    """
    parse_ret = parse_specifier(wspecifier, 'w')
    binary = 't' not in parse_ret['options']
    if parse_ret['pipe_type'] == PIPE_STD:
        t = expipes.Template()
        t.append('cat', '-.')
        return t.open('', 'wb' if binary else 'w'), binary
    elif parse_ret['pipe_type'] == PIPE_FILE:
        return std_open(parse_ret["filename"], 'wb' if binary else 'w'), binary
    else:
        # PIPE
        t = expipes.Template()
        if len(parse_ret['filename']) == 0:
            raise ValueError('Invalid wspecifier.')
        for pipe_seg in parse_ret['filename'][:-1]:
            t.append(pipe_seg, '--')
        t.append(parse_ret['filename'][-1], '-.')
        return t.open('', 'wb' if binary else 'w'), binary

# TODO(sonicmisora): add more options such as scp, p...
ALLOWED_READ_OPTIONS = ['ark']
# TODO(sonicmisora): add more options such as scp...
ALLOWED_WRITE_OPTIONS = ['ark', 't']
def parse_table_options(option_str, mode):
    if mode != 'r' and mode != 'w':
        raise ValueError("Mode can only be 'r' or 'w'.")
    if option_str == "":
        return []
    ret = []
    for option in option_str.split(','):
        if mode == 'r':
            if option not in ALLOWED_READ_OPTIONS:
                raise ValueError("Option {} not allowed in rspecifier.".format(option))
        else:
            if option not in ALLOWED_WRITE_OPTIONS:
                raise ValueError("Option {} not allowed in wspecifier.".format(option))
        if option not in ret:
            ret.append(option)
    return ret

def parse_specifier(specifier, mode):
    """Assume no colon inside filename."""
    if mode != 'r' and mode != 'w':
        raise ValueError("Mode can only be 'r' or 'w'.")
    ret = {
        'options': [],
        'wrapper_type': BLANK,
        'pipe_type': PIPE_STD,
        'filename': ""
    }
    if specifier == "":
        return ret
    colon_index = specifier.find(':')
    if colon_index != -1:
        ret["wrapper_type"] = TABLE
        table_option_str = specifier[:colon_index]
        content = specifier[colon_index+1:]
    else:
        ret["wrapper_type"] = NONTABLE
        table_option_str = ""
        content = specifier
    table_options = parse_table_options(table_option_str, mode)
    # This is an extension for wspecifier to support non-table types like 't:file.ext' to write in text mode
    if ret["wrapper_type"] == TABLE and "ark" not in table_options and "scp" not in table_options:
        ret["wrapper_type"] = NONTABLE
    ret['options'] = table_options
    content = content.strip()

    if content == '':
        raise ValueError('Null string after colon.')
    elif content == '-':
        ret['pipe_type'] = PIPE_STD
    elif content[-1] == '|':
        if mode == 'w':
            raise ValueError('Only rspecifier can have a tailing "|".')
        ret['pipe_type'] = PIPE_PIPE
        ret['filename'] = content[:-1].split('|')
    elif content[0] == '|':
        if mode == 'r':
            raise ValueError('Only wspecifier can have a leading "|".')
        ret['pipe_type'] = PIPE_PIPE
        ret['filename'] = content[1:].split('|')
    else:
        ret['pipe_type'] = PIPE_FILE
        ret['filename'] = content

    return ret

class Input:
    """
    A wrappeed read stream for user use.
    """
    def __init__(self, rspecifier=None):
        self._stream = None
        self._binary = True
        if rspecifier is not None:
            self.open(rspecifier)

    def open(self, rspecifier):
        self._stream = open_read_stream(rspecifier)
        self._binary = test_stream_binary(self._stream)

    def close(self):
        if self._stream:
            self._stream.close()
            self._stream = None

    def is_eof(self):
        """Whether all data has been read."""
        if not self._stream:
            return True
        if is_eof(self._stream):
            return True
        skip_white(self._stream)
        return is_eof(self._stream)

    def __enter__(self):
        if not self._stream:
            raise ValueError("Stream is not opened.")
        return self

    def __exit__(self, exception_type, exception_value, traceback):
        self.close()

    @property
    def stream(self):
        return self._stream

    @property
    def binary(self):
        return self._binary
