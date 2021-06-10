from typing import Optional, List, Type


class ApiError(Exception):
    """ エラーの基底となるクラス """
    status_code: int = 400
    message: str = 'API error'
    detail: str = "Error detail"

    def __init__(self, detail: Optional[str] = ""):
        self.detail = detail

    def asDict(self):
        return {"message": self.message, "detail": self.detail}


class KaldiError(ApiError):
    status_code = 500
    message = 'Kaldi error'


class DbError(ApiError):
    status_code = 500
    message = 'DB error'


def error_response(error_types: List[Type[ApiError]]) -> dict:
    # error_types に列挙した ApiError を OpenAPI の書式で定義する
    d = {}
    for et in error_types:
        if not d.get(et.status_code):
            d[et.status_code] = {
                'description': f'"{et.message}"',
                'content': {
                    'application/json': {
                        'example': {
                            'message': et.message,
                            'detail': et.detail
                        }
                    }
                }
            }
        else:
            # 同じステータスコードなら description に追記
            d[et.status_code]['description'] += f'<br>"{et.message}"'
    return d