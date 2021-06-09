import sys

from . import expipes

RXFILENAME = "rxfilename"
WXFILENAME = 'wxfilename'
RXSPECIFIER = 'rxspecifier'
WXSPECIFIER = 'wxspecifier'
FILENAME = "filename"
PIPE = "specifier"
STANDARD = "standard"
TABLE = "table"
NONTABLE = "nontable"

__all__ = ["filename_type", "open", "open_read", "open_read_table", "open_read_nontable",
           "open_write", "is_binary", "peek"]

def filename_type(filename_str, is_read):
    """The type (filename|specifier) (table|nontable) of given string."""
    ret = parse_filename(filename_str, is_read)
    return ret['type'], TABLE if ret['is_table'] else NONTABLE

std_open = open

def open(filename_str, rw):
    if rw == 'r':
        return open_read(filename_str)
    if rw == 'w':
        return open_write(filename_str)
    raise ValueError('Template.open: rw must be \'r\' or \'w\', not %r' % (rw,))

def open_read(filename_str):
    ftype, is_table = filename_type(filename_str, True)
    if is_table == TABLE:
        return open_read_table(filename_str)
    else:
        return open_read_nontable(filename_str)

def open_read_table(filename_str):
    from . import table
    return table.SequentialTableReader(filename_str)

def open_read_nontable(filename_str):
    f = parse_filename(filename_str, True)
    if f['type'] == STANDARD:
        t = expipes.Template()
        t.prepend('cat', '.-')
        return t.open('', 'rb')
    elif f['type'] == FILENAME:
        return std_open(f["filename"], 'rb')
    else:
        # PIPE
        t = expipes.Template()
        if len(f['filename']) == 0:
            raise ValueError('Invalid rxspecifier.')
        t.prepend(f['filename'][0], '.-')
        for pipe_seg in f['filename'][1:]:
            t.append(pipe_seg, '--')
        return t.open('', 'rb')

def open_write(filename_str):
    ftype, is_table = filename_type(filename_str, False)
    if is_table == TABLE:
        return open_write_table(filename_str)
    else:
        return open_write_nontable(filename_str)

def open_write_table(filename_str):
    from . import table
    return table.TableWriter(filename_str)

def open_write_nontable(filename_str):
    f = parse_filename(filename_str, False)
    binary = 't' not in f['options']
    if f['type'] == STANDARD:
        t = expipes.Template()
        t.append('cat', '-.')
        return t.open('', 'wb' if binary else 'w')
    elif f['type'] == FILENAME:
        return std_open(f["filename"], 'wb' if binary else 'w')
    else:
        # PIPE
        t = expipes.Template()
        if len(f['filename']) == 0:
            raise ValueError('Invalid wxspecifier.')
        for pipe_seg in f['filename'][:-1]:
            t.append(pipe_seg, '--')
        t.append(f['filename'][-1], '-.')
        return t.open('', 'wb' if binary else 'w')

##### Utilities

def peek(file):
    """Peek the next char of filestream."""
    return file.peek(1)[:1]

def is_eof(file):
    return len(peek(file)) == 0

def is_binary(file):
    """Test if filestream is binary format."""
    if peek(file) == b'\x00':
        # Looks like a binary file, consume '\x00'
        file.read(1)
        if peek(file) != b'B':
            raise TypeError('File looks like binary but without a following "B". Probably broken.')
        # Consume 'B'
        file.read(1)
        return True
    else:
        # Must be text file
        return False



# -------- Private methods ---------
# TODO(sonicmisora): add more options such as scp, p...
ALLOWED_READ_OPTIONS = ['ark']
# TODO(sonicmisora): add more options such as scp, t...
ALLOWED_WRITE_OPTIONS = ['ark', 't']
def parse_table_options(option_str, is_read):
    if option_str == "":
        return []
    parts = option_str.split(',')
    ret = []
    for option in parts:
        if is_read:
            if option not in ALLOWED_READ_OPTIONS:
                raise ValueError(option)
        else:
            if option not in ALLOWED_WRITE_OPTIONS:
                raise ValueError(option)
        if option not in ret:
            ret.append(option)
    return ret

def parse_filename(filename_str, is_read):
    colon_index = filename_str.find(':')
    if colon_index != -1:
        ret2 = TABLE
        table_option_str = filename_str[:colon_index]
        content = filename_str[colon_index+1:]
    else:
        ret2 = NONTABLE
        table_option_str = ""
        content = filename_str
    table_options = parse_table_options(table_option_str, is_read)
    if ret2 == TABLE and "ark" not in table_options and "scp" not in table_options:
        ret2 = NONTABLE
    content = content.strip()
    if content == '':
        raise ValueError('No command after :.')
    elif content == '-':
        ret1 = STANDARD
        filename = ""
    elif content[-1] == '|':
        if not is_read:
            raise ValueError('wxspecifier must begin with | after :.')
        ret1 = PIPE
        filename = content[:-1].split('|')
    elif content[0] == '|':
        if is_read:
            raise ValueError('rxspecifier must end with |.')
        ret1 = PIPE
        filename = content[1:].split('|')
    else:
        ret1 = FILENAME
        filename = content
    return {
        'options': table_options,
        'is_table': ret2 == TABLE,
        'type': ret1,
        'filename': filename
    }


if __name__ == '__main__':
    with open(sys.argv[1], 'r') as f:
        print(f.read())
