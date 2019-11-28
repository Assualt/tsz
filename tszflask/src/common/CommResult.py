from src.common.config import TSZ_MODEL_MYSQL,TSZ_MODEL_REDIS,TSZ_MODEL_SERVER
class HttpResult(object):
    @staticmethod
    def format(code, message, app_code, app_message) -> dict:
        return {
                "status": code,
                "message": message,
                "info": {
                    "code":app_code,
                    "message":app_message
                }
        }

    @staticmethod
    def invalid_args() ->dict:
        return {
            "status": 200,
            "message": "Request OK",
            "info" : {
                "code":400,
                "message":"Invalid Args"
            }
        }

class DBResult(object):
    @staticmethod
    def format(model_id, status, info) ->dict:
        return {
            "modelID": model_id,
            "status": status,
            "result"   : info
        }


if __name__ == '__main__':
    print(HttpResult.format(200, "OK", {"result": "OK"}))
    print(DBResult.format(TSZ_MODEL_MYSQL, "OK",None))