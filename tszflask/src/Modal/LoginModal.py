from flask_restful import reqparse, abort, Api, Resource
from src.common import *
from src.common.config import *
from datetime import datetime


class LoginModal(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('passwd', type=str)

    def get(self):
        data = self.parser.parse_args()
        user = data.get('name')
        passwd = data.get("passwd")
        if user == None or passwd == None:
            return CommResult.HttpResult.invalid_args()
        logger.info("Get Request OK. user:{user} passwd:{passwd}".format(user=user,passwd=passwd))
        sql = "select user_id,user_encrypt_pass from tsz_user_pswd where user_name = %s"
        result = Mysql.MysqlHelper().query(sql, [user])
        logger.info("Get key From mysql. result:{res}".format(res = result))
        if result["message"] == QUERY_SUCCESS:
            result_info = result["result"]
            if len(result_info) != 1:
                return CommResult.HttpResult.format(200, 'Exec OK', { "code" : 400, "status" : "Login Failed" })
            elif result_info[0][1] == passwd:
                # generator tokenx
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                token = HashHelper.Token.get_token(config.PROJECT_NAME, str(app.config['SECRET_KEY']), timestamp, user)
                key = "T" + user + str(result_info[0][0])
                Redis.setX(key,token)
                logger.info("account:{account} token:{token} timestamp:{time}".format(account=user, token=token,time=timestamp))
                return CommResult.HttpResult.format(200, 'Exec OK', { "code": 200, "status": "Login Success."})
            else:
                return CommResult.HttpResult.format(200, "Exec OK", { "code": 402, "status" : "Incorrect Password or User {u} not exist".format(u=user)})
        elif result["message"] == QUERY_FALED:
            return CommResult.HttpResult.format(200, 'Exec OK', { "code": 401, "status": "Login Failed. User {u} not exist".format(u=user)})
        else:
            return CommResult.HttpResult.format(500, 'Exec Failed', { "code": 500, "status": "Internal Error"})
