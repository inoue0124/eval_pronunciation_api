#ifndef BOOST_ROOT
#$(error please set BOOST_ROOT to point ot the base of the kaldi installation)
#endif

all:
EXTRA_CXXFLAGS = -Wno-sign-compare

PYLIB = $(shell python3-config --libs)
PYINC = $(shell python3-config --includes)
#NPINC = -I$(shell python3 -c 'import numpy; print(numpy.get_include())')
BPINC = -I$(BOOST_ROOT)
BPLIB = -L$(BOOST_ROOT)/stage/lib

TARGETS =
EXE_TARGETS = dtw.so

#include $(KALDI_SRC)/makefiles/default_rules.mk

%.so: %.cpp
		#g++ -shared -o $@ -Wall -fPIC -I$(KALDI_SRC) $(PYINC) $(NPINC) $(CXXFLAGS) $< $(ADDLIBS) $(LDFLAGS) -L$(PYLIB) $(LOADLIBES) $(LDLIBS) -lboost_python
		g++ -shared -o $@ -Wall -fPIC $(BPINC) $(PYINC) $< $(LDFLAGS) $(BPLIB) $(PYLIB) -lboost_python3 -lboost_numpy3

%.exe: %.cpp
		g++ -o $@ -Wall -fPIC $(BPINC) $(PYINC) $< $(LDFLAGS) $(BPLIB) $(PYLIB) -lboost_python3 -lboost_numpy3
clean:
	-rm -f *.o *.a *.so $(TESTFILES) $(BINFILES) $(TESTOUTPUTS) tmp* *.tmp
	-rm -f *.exe

test:

all: $(TARGETS) $(EXE_TARGETS)
