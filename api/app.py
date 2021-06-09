from typing import Final
from fastapi import FastAPI
from api.presenter import route

app: Final = FastAPI()

route.add_routes(app=app)
