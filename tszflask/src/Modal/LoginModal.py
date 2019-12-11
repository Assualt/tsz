from flask_restful import reqparse, Resource
from src.common import *
from src.common.Config import *
from datetime import datetime
from src.const import SQLFormatter as sql

class LoginModal(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('passwd', type=str)

    def get(self):
        return CommResult.HttpResult.unsupported_method()

    def post(self):
        data = self.parser.parse_args()
        user = data.get('name')
        passwd = data.get("passwd")
        logger.info("Get Request OK. user:{user} passwd:{passwd}".format(user=user, passwd=passwd))
        if user == None or passwd == None:
            return CommResult.HttpResult.invalid_args()
        result = Mysql.MysqlHelper().query(sql.SQL_QUERY_ID_PASSWD, [user])
        logger.debug("Get key From mysql. result:{res}".format(res = result))
        if result["status"] == QUERY_SUCCESS:
            result_info = result["result"]
            if len(result_info) != 1:
                logger.warning("query {u} result(s) have(s) been found over one ".format(u=user))
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_500_INTERNAL_ERROR, AppStatus.APP_500_MESSAGE)
            elif result_info[0][1] == passwd:
                # generator token_x
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                token = HashHelper.Token.generate_token(Config.PROJECT_NAME, user)
                key = "T" + user + str(result_info[0][0])
                Redis.setX(key,token, expire_time=Config.LOGIN_TIME_OUT)
                # cookie should be  { strcookieMd5;cookie;expiresDays;}
                cookie = HashHelper.hash_md5(token)
                str_cookie_sha1 = HashHelper.hash_sha1(cookie)
                str_expiresDays = Config.LOGIN_TIME_OUT / 86400
                ret_cookie = '{m1};{c};{e}'.format(m1=str_cookie_sha1,c=cookie,e=str_expiresDays)
                logger.info("s:{s} s1:{s1}".format(s=cookie, s1=str_cookie_sha1))
                logger.info("account:{account} token:{token} timestamp:{time} ret_cookie:{ret_cookie}".format(account=user, token=token,time=timestamp,ret_cookie=ret_cookie))
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_200_OK, ret_cookie)
            else:
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, 402, "Incorrect Password or User {u} not exist".format(u=user))
        elif result["status"] == QUERY_FALED:
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, 401, "Login Failed. User {u} not exist".format(u=user))
        else:
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_500_INTERNAL_ERROR, AppStatus.APP_500_MESSAGE)


class LoginOutModal(Resource):

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('s_token')
        self.parser.add_argument('s_user')

    def post(self)->dict:
        data = self.parser.parse_args()
        s_token = data.get('s_token')
        s_user = data.get('s_user')
        if s_token == None or s_user == None:
            return CommResult.HttpResult.invalid_args()
        # check the user found in database
        dbresult = Mysql.MysqlHelper().query(sql.SQL_QUERY_ID_EXISTS, [s_user])
        if dbresult['status'] == QUERY_FALED or dbresult['result'] is None:
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, 402, "User {u} not found in datebase.".format(u=s_user))
        s_user_id = dbresult['result'][0][0]
        # check the token is vaild or not
        message = HashHelper.Token.certify_token(Config.PROJECT_NAME, s_user, s_token)

        if message != "":
            logger.warning('check token for {u} failed. reason:{r}'.format(u=s_user, r=message))
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_400_BAD_REQUEST, message)
        # check the user is online or not in redis
        key = 'T' + s_user + str(s_user_id)
        dbresult = Redis.getX(key)
        if dbresult['status'] == QUERY_FALED:
            logger.info('current user:{u} not logined. no need to loginout'.format(u=s_user))
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_403_UNRESOLVED_TYPE, "Current user is no need to loginout")
        val = dbresult['result']
        if val and val == s_token:
            # remove the key from redis
            Redis.delX(key)
            logger.info('user:{u} has been logined out'.format(u=s_user))
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE,AppStatus.APP_200_OK, "Loginout OK")
        logger.info('current user:{u} invalid logined. no need to loginout'.format(u=s_user))
        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, 302 , "Loginout OK")

    def get(self):
        return CommResult.HttpResult.unsupported_method()