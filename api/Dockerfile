FROM kaldiasr/kaldi:latest

ENV PATH $PATH:/opt/kaldi/src/bin:/opt/kaldi/src/chainbin:/opt/kaldi/src/featbin:/opt/kaldi/src/fgmmbin:/opt/kaldi/src/fstbin:/opt/kaldi/src/gmmbin:/opt/kaldi/src/ivectorbin:/opt/kaldi/src/kwsbin:/opt/kaldi/src/latbin:/opt/kaldi/src/lmbin:/opt/kaldi/src/nnet2bin:/opt/kaldi/src/nnet3bin:/opt/kaldi/src/nnetbin:/opt/kaldi/src/online2bin:/opt/kaldi/src/onlinebin:/opt/kaldi/src/rnnlmbin:/opt/kaldi/src/sgmm2bin:/opt/kaldi/src/sgmmbin:/opt/kaldi/src/tfrnnlmbin:/opt/kaldi/src/cudadecoderbin

RUN rm src/*/*cc && \
  rm src/*/*h && \
  rm -rf CMakeLists.txt COPYING INSTALL README.md cmake docker egs misc scripts windows && \
  apt update && \
  apt autoclean && \
  apt install -y --no-install-recommends build-essential \
  zlib1g-dev \
  libncurses5-dev \
  libgdbm-dev \
  libnss3-dev \
  libssl-dev \
  libreadline-dev \
  libffi-dev \
  curl \
  libbz2-dev \
  mecab \
  libmecab-dev \
  libmecab2 \
  swig \
  mecab-ipadic \
  mecab-ipadic-utf8 \
  libsox-fmt-all && \
  curl -O https://www.python.org/ftp/python/3.9.5/Python-3.9.5.tar.xz && \
  tar -xf Python-3.9.5.tar.xz && \
  rm Python-3.9.5.tar.xz && \
  cd Python-3.9.5 && \
  ./configure --enable-optimizations && \
  make -j 8 && \
  make altinstall && \
  apt install -y python3-pip && \
  update-alternatives --install /usr/bin/python3 python3 /usr/local/bin/python3.9 10 && \
  rm -rf /opt/kaldi/Python-3.9.5

RUN apt install -y --no-install-recommends gcc libmariadb-dev ffmpeg
RUN pip3.9 install fastapi uvicorn vosk mecab-python3 unidic-lite fastdtw scipy numpy sqlalchemy mysqlclient bcrypt python-jose python-multipart boto3 ffmpeg-python Gunicorn

WORKDIR /

EXPOSE 80