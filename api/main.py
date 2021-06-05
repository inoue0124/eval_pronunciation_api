import subprocess
from typing import Optional
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    result = subprocess.run(["head", "-n", "5", "."],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE)
    return result