#!/usr/bin/env python3
import sys
import os
import re
import numpy as np
sys.path.append(os.path.dirname(os.path.realpath(__file__)) + "/../src")
from smlib.kaldi import iobase, reader, writer
from smlib.calc import dtw

if len(sys.argv) != 5:
    print("Usage: %s <student-post-rspecifier> <model-post-rspecifier> <dist-mode> <result-wspecifier>" % (sys.argv[0]))
    print("  <dist-mode>='e' | 'b'. 'e'=Euclid, 'b'=Bhatacharyya")
    exit(1)

stu_post_path = sys.argv[1]
model_post_path = sys.argv[2]
dist_mode = sys.argv[3]
result_path = sys.argv[4]

def softmax(x):
    """Compute softmax values for matrix x."""
    e_x = np.exp(x - x.max(axis = 1).reshape(len(x), 1))
    return e_x / e_x.sum(axis=1).reshape(len(x), 1)

def euclid_dist(v1, v2):
    return np.sqrt(((v1 - v2) ** 2).sum())

def bhat_dist(v1, v2):
    """Bhatacharyya distance require v1 and v2 to be sqrt."""
    return -np.log((v1 * v2).sum())

def kl_dist(v1, v2, vl1, vl2):
    """vl1 and vl2 are the log value of v1 and v2"""
    return (v1 * (vl1 - vl2)).sum()

def calc_dist(p1, p2, dist_type="b"):
    p1 = softmax(p1)
    p2 = softmax(p2)
    if dist_type == "e":
        dist = cdist(p1, p2, metric="euclidean").astype(np.float64)
    elif dist_type == "b":
        p1 = np.sqrt(p1)
        p2 = np.sqrt(p2)
        dist = -np.log(np.dot(p1, p2.T))
    else:
        raise ValueError("Unknown dist type %s" % (dist_type))

    return dist.astype(np.float64)

model_posts = {}
with iobase.open(model_post_path, 'r') as model_post_table:
    id_pat = re.compile(r'^([^_]+)_([^_]+)_([^_]+)$')
    for key, fs in model_post_table:
        res = id_pat.search(key)
        print(res)
        if not res:
            raise ValueError("Unexpected key format {}".format(key))
        id_index = res.group(3)
        post = reader.read_wrapped_matrix(fs)
        model_posts[id_index] = post
    print(len(model_posts))

with iobase.open(result_path, 'w') as result_table:
    with iobase.open(stu_post_path, 'r') as stu_post_table:
        id_pat = re.compile(r'^([^_]+)_([^_]+)_([^_]+)$')
        for key, fs in stu_post_table:
            res = id_pat.search(key)
            if not res:
                raise ValueError("Unexpected key format {}.".format(key))
            id_index = res.group(3)
            if id_index not in model_posts:
                raise ValueError("Unknown sentence index {}".format(id_index))
            print(key)
            post = reader.read_wrapped_matrix(fs)
            model_post = model_posts[id_index]

            dist = calc_dist_new(post, model_post, dist_mode)
            print("Dist shape:", dist.shape)
            success, res, path = dtw.dtw(dist)
            if not success:
                print("WARNING: Sentence {} not successfully dtw.".format(key))
                continue
            print("Res:", res / sum(dist.shape))
            sys.stdout.flush()

            result_fs = result_table.write(key)
            writer.write_file_begin(result_fs, result_table.binary)
            writer.write_float64(result_fs, result_table.binary, res / sum(dist.shape))
            writer.write_file_end(result_fs, result_table.binary)

print("Successfully exported dtw result to {}".format(result_path))
