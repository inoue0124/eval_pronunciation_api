import kaldi_io as kio

with kio.TableWriter('ark:/home/jwyue/tmp/test.ark') as writer:
    with kio.SequentialMatrixFloat32Reader('ark:gunzip -c /home/jwyue/tools/kaldi/egs/wsj/sd/exp/dnn5b_pretrain-dbn_dnn_smbr/decode_bd_tgpr_sd/it3/post.1.gz|') as reader:
        for v in reader:
            #print(reader.key)
            writer.write(reader.key, kio.BasicFloat32(v.data[0][0]))
