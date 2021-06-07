#include "boost/python/numpy.hpp"

namespace p = boost::python;
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

template <class T>
p::list toPythonList(std::vector<T> vector) {
	typename std::vector<T>::iterator iter;
	boost::python::list list;
	for (iter = vector.begin(); iter != vector.end(); ++iter) {
		list.append(*iter);
	}
	return list;
}

/*
 * dist: Distance array to be computed. Must be 2-dimensional.
 */
p::tuple dtw_internal(const np::ndarray& dist) {
    if (dist.get_nd() != 2) {
        throw MyException("dist must be a two-dimensional array.");
    }
    const int MAX_ROLL = 2;
    int n1 = dist.shape(0);
    int n2 = dist.shape(1);
    std::vector<double> f[MAX_ROLL];
    std::vector<std::vector<unsigned char> > pathRecord(n1);
    for (int i = 0; i < n1; i++) {
        pathRecord[i].resize(n2);
    }
    for (int i = 0; i < MAX_ROLL; i++) {
        f[i].resize(n2);
    }
    f[0][0] = p::extract<double>(dist[0][0]);
    for (int i = 0; i < n1; i++) {
        int now = i % MAX_ROLL;
        int last = (i + 1) % MAX_ROLL;
        for (int j = 0; j < n2; j++) {
            double d = p::extract<double>(dist[i][j]);
            if (i != 0 || j != 0) {
                f[now][j] = INFINITY;
            }
            if (i > 0) {
                if (f[now][j] > f[last][j] + d) {
                    f[now][j] = f[last][j] + d;
                    pathRecord[i][j] = 1;
                }
            }
            if (j > 0) {
                if (f[now][j] > f[now][j - 1] + d) {
                    f[now][j] = f[now][j - 1] + d;
                    pathRecord[i][j] = 2;
                }
            }
            if (i > 0 && j > 0) {
                if (f[now][j] > f[last][j - 1] + 2 * d) {
                    f[now][j] = f[last][j - 1] + 2 * d;
                    pathRecord[i][j] = 3;
                }
            }
        }
    }
    if (pathRecord[n1 - 1][n2 - 1] == 0) {
        // Return failed dtw
        return p::make_tuple(false, p::object(), p::object());
    }
    double bestResult = f[(n1 - 1) % MAX_ROLL][n2 - 1];
    std::vector<p::tuple> bestPath;
    int x = n1 - 1;
    int y = n2 - 1;
    while (x != 0 || y != 0) {
        bestPath.push_back(p::make_tuple(x, y));
        int lastStep = pathRecord[x][y];
        x -= (lastStep == 1 || lastStep == 3 ? 1 : 0);
        y -= (lastStep == 2 || lastStep == 3 ? 1 : 0);
    }
    bestPath.push_back(p::make_tuple(0, 0));
    return p::make_tuple(true, bestResult, toPythonList(bestPath));
}

p::tuple mydtw_internal(const np::ndarray& dist) {
    if (dist.get_nd() != 2) {
        throw MyException("dist must be a two-dimensional array.");
    }
    int n1 = dist.shape(0);
    int n2 = dist.shape(1);
    const int MAX_ROLL = n1;
    
    std::vector<double> f[MAX_ROLL];
    std::vector<std::vector<unsigned int> > pathRecord(n1);
    for (int i = 0; i < n1; i++) {
        pathRecord[i].resize(n2);
    }
    for (int i = 0; i < MAX_ROLL; i++) {
        f[i].resize(n2);
    }
    f[0][0] = p::extract<double>(dist[0][0]);
    for (int i = 0; i < n1; i++) {
        for (int j = 0; j < n2; j++) {
            double d = p::extract<double>(dist[i][j]);
            
            if (i != 0 || j != 0) {
                f[i][j] = INFINITY;
            }
            if (j > 0) {
                for (int k = 0; k < n2; k++) {
                    if (f[k][j] > f[k][j - 1] + d) {
                        f[k][j] = f[k][j - 1] + d * (k > i ? k - i : i - k);
                        pathRecord[i][j] = k;
                    }
                }
            }
            if (i > 0) {
                if (f[i][j] > f[i - 1][j] + d) {
                    f[i][j] = f[i - 1][j] + d;
                    pathRecord[i][j] = -1;
                }
            }
        }
    }
    // There is no fail dtw in this algorithm
    /*
    if (pathRecord[n1 - 1][n2 - 1] == 0) {
        // Return failed dtw
        return p::make_tuple(false, p::object(), p::object());
    }
    */
    double bestResult = f[n1 - 1][n2 - 1];
    std::vector<p::tuple> bestPath;
    int x = n1 - 1;
    int y = n2 - 1;
    while (x != 0 || y != 0) {
        bestPath.push_back(p::make_tuple(x, y));
        int lastStep = pathRecord[x][y];
        if (lastStep == -1) {
            y--;
        }
        else {
            x--;
            y = lastStep;
        }
    }
    bestPath.push_back(p::make_tuple(0, 0));
    return p::make_tuple(true, bestResult, toPythonList(bestPath));
}

void translate(const std::exception & e)
{
    // Use the Python 'C' API to set up an exception object
    PyErr_SetString(PyExc_RuntimeError, e.what());
}

BOOST_PYTHON_MODULE(dtw)
{
    np::initialize();
    p::register_exception_translator<std::exception>(&translate);
    p::def("dtw", &dtw_internal);
    p::def("mydtw", &mydtw_internal);
}
