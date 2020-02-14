from flask_restful import reqparse, Resource
from src.common import Config,CommResult,Redis,Mysql,HttpStatus,AppStatus,logger
from src.const import SQLFormatter as sql
import random

IDentityCode_TimeOut = 5 * 60


class RegisterModal(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('passwd', type=str)
        self.parser.add_argument('identifying_code', type=str)

    def post(self):
        data = self.parser.parse_args()
        username = data.get('name')
        passwd = data.get('passwd')
        identifying_code = data.get('identifying_code')
        if username == None or passwd == None or identifying_code == None:
            return CommResult.HttpResult.invalid_args()
        # GET IDentity code from redis
        key = 'R' + username
        result = Redis.getX(key)
        if result['status'] == Config.QUERY_SUCCESS:
            if result['result'] != None and result['result'] == identifying_code:
                # update the mysql tsz_user_pswd
                my = Mysql.MysqlHelper()
                sqlResult = my.query(sql.SQL_QUERY_ID)
                if sqlResult['status'] == Config.QUERY_SUCCESS:
                    user_id = sqlResult['result'][0][0] + 1
                    sqlResult = my.insert(sql.SQL_INSERT_VAL,[user_id, username, passwd])
                    logger.info('flush user={u} to mysql {s} errmsg={e}'.format(u=username, s=sqlResult['status'], e=sqlResult['result']))
                    if sqlResult['status'] == Config.EXEC_SUCCESS:
                        Redis.delX(key)
                        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_200_OK, "Register OK")
                    else:
                        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_500_INTERNAL_ERROR, AppStatus.APP_500_MESSAGE)
                else:
                    return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_500_INTERNAL_ERROR, AppStatus.APP_500_MESSAGE)
            else:
                logger.info('user={u} with identity_code={i} Register Failed invalid indentity_code'.format(u=username,i=identifying_code))
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_300_BAD_RESULT, "Incrrorect Identity Code")
        elif result['status'] == Config.QUERY_FALED:
            logger.info('user={u} identity_code={i} has been expired.'.format(u=username,i=identifying_code))
        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_301_INVALID_ARGS, "Register Failed due to expired Identity Code.")


    def get(self)->dict:
        return CommResult.HttpResult.unsupported_method()

class IdentityModal(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('type', type=int)

    def get(self):
        data = self.parser.parse_args()
        username = data.get('name')
        utype = data.get('type')
        logger.info("get {u} and type:{t}".format(u=username,t=utype))
        identity_code  = self.get_random_number()

        ###
        # send identity code to the user
        # please in IDentityCode_TimeOut to update
        ###

        if utype == 1:
            # Register Identity Code
            key = 'R' + username
            result = Redis.setX(key,identity_code, IDentityCode_TimeOut)
            if result['status'] == Config.EXEC_FAILED:
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_500_INTERNAL_ERROR, result['result'])
        elif utype == 2:
            # forget password to Idenity Code
            key = 'F' + username
            result = Redis.setX(key, identity_code, IDentityCode_TimeOut)
            if result['status'] == Config.EXEC_FAILED:
                return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_500_INTERNAL_ERROR, result['result'])
        else:
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK,HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_403_UNRESOLVED_TYPE, AppStatus.APP_403_MESSAGE)
        logger.info("Get Identity code for {u} OK. identity code:{c} timeout:{t}".format(u=username, c=identity_code, t=IDentityCode_TimeOut))
        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK,HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_200_OK, "Identity Code has been sent.")

    def get_random_number(self) -> str:
        return random.randint(100000, 999999)

    def post(self)->dict:
        return CommResult.HttpResult.unsupported_method()