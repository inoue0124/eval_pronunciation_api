#include "boost/python/numpy.hpp"

#include "base/kaldi-common.h"
#include "util/common-utils.h"
#include "matrix/kaldi-matrix.h"

namespace bp = boost::python;
namespace np = boost::python::numpy;

struct MyException : std::exception
{
    std::string msg;
    MyException(std::string msg = ""):msg(msg) {}
    ~MyException() throw() {}
    const char * what() const throw() {
        return msg.c_str();
    }
};

// ---------- Converters ----------

// template<class Real>
// struct MatrixToNdArrayConverter {
//
//     static inline bp::object kaldi_to_python(const kaldi::Matrix<Real>& mat) {
//         npy_intp dims[2];
//         dims[0] = mat.NumRows();
//         dims[1] = mat.NumCols();
//         int nd = 2;
//         int arr_type = kaldi::get_np_type<Real>();
//         PyObject* ao = PyArray_SimpleNew(nd, dims, arr_type);
//         bp::object arr=bp::object(bp::handle<>(ao));
//         kaldi::NpWrapperMatrix<Real> arr_wrap((PyArrayObject*)arr.ptr());
//         arr_wrap.CopyFromMat(mat);
//         return arr;
//     }
//
//     static inline kaldi::NpWrapperMatrix<Real>* python_to_kaldi(bp::object o) {
//         PyObject* raw_arr = PyArray_FromAny(o.ptr(),PyArray_DescrFromType(kaldi::get_np_type<Real>()), 2, 2, NPY_C_CONTIGUOUS | NPY_FORCECAST, NULL);
//         //why does this fail: bp::object arr(bp::handle<>(raw_arr));
//         bp::object arr=bp::object(bp::handle<>(raw_arr));
//         return new kaldi::NpWrapperMatrix<Real>((PyArrayObject*)arr.ptr());
//     }
// };

//----------- Wrappers ------------

class SequentialFloat64MatrixReaderWrapper {
public:
    SequentialFloat64MatrixReaderWrapper() {}
    SequentialFloat64MatrixReaderWrapper(const std::string& rspecifier) {
        if (!Open(rspecifier)) {
            throw MyException("Open file failed");
        }
    }

    bool Open(const std::string& rspecifier) {
        return holder_.Open(rspecifier);
    }

    bool IsOpen() {
        return holder_.IsOpen();
    }

    bool Done() {
        return holder_.Done();
    }

    bool Close() {
        return holder_.Close();
    }

    void Next() {
        holder_.Next();
    }

    bp::object Value() {
        //return holder_.Value();
        return bp::object();
    }

    std::string Key() {
        return holder_.Key();
    }

    static void RegisterPython() {
        bp::class_<SequentialFloat64MatrixReaderWrapper>("SequentialFloat64MatrixReader", bp::init<std::string>())
            .def("open", &SequentialFloat64MatrixReaderWrapper::Open);
    }

private:
    kaldi::SequentialDoubleMatrixReader holder_;
};

void translate(const std::exception & e)
{
    // Use the Python 'C' API to set up an exception object
    PyErr_SetString(PyExc_RuntimeError, e.what());
}


BOOST_PYTHON_MODULE(io_internal)
{
    np::initialize();
    bp::register_exception_translator<std::exception>(&translate);
    SequentialFloat64MatrixReaderWrapper::RegisterPython();
}
