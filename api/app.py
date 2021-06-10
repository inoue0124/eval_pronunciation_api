from typing import Final
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from api.presenter import route
from .util.errors import ApiError

app: Final = FastAPI()

route.add_routes(app=app)


@app.exception_handler(ApiError)
async def api_error_handler(request, err: ApiError):
    return JSONResponse(status_code=err.status_code, content=err.asDict())
