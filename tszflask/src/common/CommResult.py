from src.common.config import TSZ_MODEL_MYSQL,TSZ_MODEL_REDIS,TSZ_MODEL_SERVER
class HttpResult(object):
    @staticmethod
    def format(code, message, info) -> dict:
        return {
                "status": code,
                "message": message,
                "info": info
        }

    @staticmethod
    def invalid_args() ->dict:
        return {
            "status": 200,
            "message": "Exec Failed",
            "info" : {
                "code":400,
                "status":"Invalid Args"
            }
        }

class DBResult(object):
    @staticmethod
    def format(model_id, message, info) ->dict:
        return {
            "modelID": model_id,
            "message": message,
            "result"   : info
        }


if __name__ == '__main__':
    print(HttpResult.format(200, "OK", {"result": "OK"}))
    print(DBResult.format(TSZ_MODEL_MYSQL, "OK",None))