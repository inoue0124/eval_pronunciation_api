#!/usr/bin/env python3
import sys
import os
import numpy as np
sys.path.append(os.path.dirname(os.path.realpath(__file__)) + "/../src")
from smlib.kaldi import iobase, reader, writer

not_use_softmax = False

while len(sys.argv) >= 6 and len(sys.argv[1]) > 0 and sys.argv[1][0] == '-':
    if sys.argv[1] == '-n':
        sys.argv.pop(1)
        not_use_softmax = True
    else:
        print("Unknown option %s" % (sys.argv[1]))
        exit(1)

if len(sys.argv) != 6:
    print("Usage: %s [options] <model> <nonsilence-int> <post-rxspecifier> <align-rxspecifier> <gop-wxspecifier>" % (sys.argv[0]))
    print("Options:")
    print("  -n, if this option is used, the features will not be normalized by softmax, but a simple multiplication to")
    print("     make the sum to 1.")
    exit(1)

model_fn = sys.argv[1]
nsil_fn = sys.argv[2]
post_rx = sys.argv[3]
ali_rx = sys.argv[4]
gop_wx = sys.argv[5]

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

assert(iobase.filename_type(model_fn, True)[1] == iobase.NONTABLE)
assert(iobase.filename_type(post_rx, True)[1] == iobase.TABLE)
assert(iobase.filename_type(ali_rx, True)[1] == iobase.TABLE)

with open(nsil_fn, 'r') as f:
    nsil_set = {}
    for line in f:
        phone_int = int(line.strip())
        nsil_set[phone_int] = True
    #print(nsil_set)

with iobase.open(model_fn, 'r') as model_file:
    model = reader.read_wrapped_transition_model(model_file)
    #print(model['triples'])
    phone2pdfs = {}
    for t in model['triples']:
        phone = t['phone']
        pdf = t['pdf']
        # We only care about non-silence phones
        if phone not in nsil_set:
            continue
        if phone not in phone2pdfs:
            phone2pdfs[phone] = {}
        phone2pdfs[phone][pdf] = True

def softmax(x):
    """Compute softmax values for matrix x."""
    e_x = np.exp(x - x.max(axis = 1).reshape(len(x), 1))
    return e_x / e_x.sum(axis=1).reshape(len(x), 1)

def multiply(x):
    """Compute a matrix so that the sum of each row is 1."""
    return x / x.sum(axis=1).reshape(len(x), 1)

with iobase.open(gop_wx, 'w') as gop_table:
    with iobase.open(post_rx, 'r') as post_table:
        with iobase.open(ali_rx, 'r') as ali_table:
            done_cnt = 0
            for ali_key, ali_fs in ali_table:
                # print(ali_key)
                ali = reader.read_wrapped_vector_int32(ali_fs)

                while True:
                    post_key, post_fs = post_table.next()
                    post = reader.read_wrapped_matrix(post_fs)
                    if post_key != ali_key:
                        eprint("Post_key skipped:{}".format(post_key))
                    else:
                        break
                if len(ali) != len(post):
                    raise ValueError('For key {}, aligment frames({}) != post frames({})'.
                                     format(ali_key, len(ali), len(post)))

                if not_use_softmax:
                    # apply a multiplication to post table to make sum to 1
                    post = multiply(post)
                else:
                    # apply softmax to post table
                    post = softmax(post)
                total = 0
                cnt = 0
                for post_frame, phone in zip(post, ali):
                    if phone not in nsil_set:
                        continue
                    s = 0
                    for pdf in phone2pdfs[phone].keys():
                        s += post_frame[pdf]
                    total += s
                    cnt += 1

                gop_fs = gop_table.write(ali_key)
                writer.write_file_begin(gop_fs, gop_table.binary)
                writer.write_float32(gop_fs, gop_table.binary, total / cnt)
                writer.write_file_end(gop_fs, gop_table.binary)

                done_cnt += 1
                if done_cnt % 100 == 0:
                    eprint(done_cnt, "Done")

            #print('Nonsilence Frame Count:{}, Mean GOP:{}'.format(cnt, total / cnt))
