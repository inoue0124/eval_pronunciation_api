ifndef KALDI_ROOT
$(error please set KALDI_ROOT to point ot the base of the kaldi installation)
endif
ifndef BOOST_ROOT
$(error please set BOOST_ROOT to point ot the base of the kaldi installation)
endif

all:
EXTRA_CXXFLAGS = -Wno-sign-compare

KALDI_SRC = $(KALDI_ROOT)/src

include $(KALDI_SRC)/kaldi.mk

BINFILES =


OBJFILES =


ADDLIBS = $(KALDI_SRC)/lm/kaldi-lm.a $(KALDI_SRC)/decoder/kaldi-decoder.a $(KALDI_SRC)/lat/kaldi-lat.a \
          $(KALDI_SRC)/hmm/kaldi-hmm.a $(KALDI_SRC)/transform/kaldi-transform.a $(KALDI_SRC)/gmm/kaldi-gmm.a \
	      $(KALDI_SRC)/tree/kaldi-tree.a $(KALDI_SRC)/matrix/kaldi-matrix.a  $(KALDI_SRC)/util/kaldi-util.a \
          $(KALDI_SRC)/base/kaldi-base.a  $(KALDI_SRC)/thread/kaldi-thread.a

TESTFILES =

PYLIB = $(shell python3-config --libs)
PYINC = $(shell python3-config --includes)
NPINC = -I$(shell python3 -c 'import numpy; print(numpy.get_include())')
BPINC = -I$(BOOST_ROOT)
BPLIB = -L$(BOOST_ROOT)/stage/lib

TARGETS = io_internal.so
EXE_TARGETS =

#include $(KALDI_SRC)/makefiles/default_rules.mk

%.so: %.cpp
		#g++ -shared -o $@ -Wall -fPIC -I$(KALDI_SRC) $(PYINC) $(NPINC) $(CXXFLAGS) $< $(ADDLIBS) $(LDFLAGS) -L$(PYLIB) $(LOADLIBES) $(LDLIBS) -lboost_python
		g++ -shared -o $@ -Wall -fPIC -I$(KALDI_SRC) $(BPINC) $(PYINC) $(CXXFLAGS) $< $(ADDLIBS) $(LDFLAGS) $(BPLIB) $(PYLIB) $(LOADLIBES) $(LDLIBS) -lboost_python3 -lboost_numpy3

%.exe: %.cpp
		g++ -o $@ -Wall -fPIC -I$(KALDI_SRC) $(BPINC) $(PYINC) $(CXXFLAGS) $< $(ADDLIBS) $(LDFLAGS) $(BPLIB) $(PYLIB) $(LOADLIBES) $(LDLIBS) -lboost_python3 -lboost_numpy3
clean:
	-rm -f *.o *.a *.so $(TESTFILES) $(BINFILES) $(TESTOUTPUTS) tmp* *.tmp
	-rm -f *.exe

depend:
	-$(CXX) -I$(KALDI_SRC) $(BPINC) -M $(CXXFLAGS) *.cpp > .depend.mk

test:

all: $(TARGETS) $(EXE_TARGETS)
