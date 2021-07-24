from typing import Final
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from api.presenter import route
from .util.errors import ApiError

app: Final = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

route.add_routes(app=app)


@app.exception_handler(ApiError)
async def api_error_handler(request, err: ApiError):
    return JSONResponse(status_code=err.status_code, content=err.asDict())
