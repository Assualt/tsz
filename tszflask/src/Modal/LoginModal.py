from flask_restful import reqparse, abort, Api, Resource
from src.common import *
from src.common.config import *
from datetime import datetime

SQL_QUERY_ID_PASSWD = "select user_id,user_encrypt_pass from tsz_user_pswd where user_name = %s"

class LoginModal(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('passwd', type=str)

    def get(self):
        return CommResult.HttpResult.format(HttpStatus.HTTP_405_METHOD_NOT_ALLOWED, HttpStatus.HTTP_405_MESSAGE,{"code": AppStatus.APP_300_BAD_RESULT, "message": ""})

    def post(self):
        data = self.parser.parse_args()
        user = data.get('name')
        passwd = data.get("passwd")
        logger.info("Get Request OK. user:{user} passwd:{passwd}".format(user=user, passwd=passwd))
        if user == None or passwd == None:
            return CommResult.HttpResult.invalid_args()
        result = Mysql.MysqlHelper().query(SQL_QUERY_ID_PASSWD, [user])
        logger.info("Get key From mysql. result:{res}".format(res = result))
        if result["status"] == QUERY_SUCCESS:
            result_info = result["result"]
            if len(result_info) != 1:
                logger.warning("query {u} result(s) have(s) been found over 1 ".format(u=user))
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, {"code": AppStatus.APP_500_INTERNAL_ERROR, "message" : AppStatus.APP_500_MESSAGE})
            elif result_info[0][1] == passwd:
                # generator tokenx
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                token = HashHelper.Token.get_token(config.PROJECT_NAME, str(config.KEY), timestamp, user)
                key = "T" + user + str(result_info[0][0])
                Redis.setX(key,token)
                logger.info("account:{account} token:{token} timestamp:{time}".format(account=user, token=token,time=timestamp))
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, {"code": AppStatus.APP_200_OK, "message" : "Login Success"})
            else:
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, { "code": 402, "message" : "Incorrect Password or User {u} not exist".format(u=user)})
        elif result["status"] == QUERY_FALED:
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, { "code": 401, "message": "Login Failed. User {u} not exist".format(u=user)})

        else:
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, {"code": AppStatus.APP_500_INTERNAL_ERROR, "message": AppStatus.APP_500_MESSAGE})
