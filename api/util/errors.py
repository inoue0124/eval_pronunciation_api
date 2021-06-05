from typing import Optional, List, Type


class ApiError(Exception):
    """ エラーの基底となるクラス """
    status_code: int = 400
    message: str = 'API error'

    def __init__(self, reason: Optional[str] = None):
        if reason:
            self.reason = reason

    def __str__(self):
        return f'{self.message}\n{self.reason}'


class KaldiError(ApiError):
    status_code = 500
    message = 'an error has occured while computing by kaldi'


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
                            'message': et.message
                        }
                    }
                }
            }
        else:
            # 同じステータスコードなら description に追記
            d[et.status_code]['description'] += f'<br>"{et.message}"'
    return d