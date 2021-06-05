import subprocess
from typing import Optional
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from api.util.errors import ApiError, KaldiError, error_response
from api.presenter.score.gop import Gop
from api.infra.repository.score import Score

app = FastAPI()


# エラーの共通処理
@app.exception_handler(ApiError)
async def api_error_handler(request, err: ApiError):
    return JSONResponse(
        status_code=err.status_code,
        content={"message": f"{err.message}\n{err.reason}"},
    )


@app.get("/")
def read_root():
    score = Score()
    gop = Gop(score=Score)
    gop.get_gop()


# @app.get("/", responses=error_response([KaldiError]))
# def read_root():
#     if (err := compute_mfcc()):
#         raise KaldiError(reason="compute-mfcc got an error")
#     return compute_mfcc()

# def compute_mfcc() -> Optional[Exception]:
#     cmd: str = "compute-mfcc-feats --use-energy=false --sample-frequency=16000 scp,p:data/wav.scp ark,t:/tmp/mfcc.ark"
#     result: subprocess.CompletedProcess = subprocess.run(cmd, shell=True)
#     try:
#         result.check_returncode()
#     except subprocess.CalledProcessError as e:
#         return e
