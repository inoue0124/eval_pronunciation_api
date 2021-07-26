from datetime import datetime, timedelta
from api.util.config import ALGORITHM, SECRET_KEY, ACCESS_TOKEN_EXPIRE_DAYS
from jose import jwt

def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    data.update({"exp": expire})
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt