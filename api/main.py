from typing import Final
from fastapi import FastAPI
from api.presenter import route

app: Final = FastAPI()

route.add_routes(app=app)

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
