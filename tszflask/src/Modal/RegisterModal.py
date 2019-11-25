from flask_restful import reqparse, Resource
from src.common import *
import random

IDentityCode_TimeOut = 5 * 60

SQL_INSERT_VAL = 'insert into tsz_user_pswd(user_id,user_name,user_encrypt_pass) values(%s,%s,%s)'
SQL_QUERY_ID = 'select max(user_id) from tsz_user_pswd'

class RegisterModal(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('passwd', type=str)
        self.parser.add_argument('identifying_code', type=str)

    def get(self):
        data = self.parser.parse_args()
        username = data.get('name')
        passwd = data.get('passwd')
        identifying_code = data.get('identifying_code')
        if username == None or passwd == None or identifying_code == None:
            return CommResult.HttpResult.invalid_args()
        # GET IDentity code from redis
        key = 'R' + username
        result = Redis.getX(key)
        if result['status'] == config.QUERY_SUCCESS:
            if result['result'] != None and result['result'].decode() == identifying_code:
                # update the mysql tsz_user_pswd
                my = Mysql.MysqlHelper()
                sqlResult = my.query(SQL_QUERY_ID)
                if sqlResult['status'] == config.QUERY_SUCCESS:
                    user_id = sqlResult['result'][0][0] + 1
                    sqlResult = my.insert(SQL_INSERT_VAL,[user_id, username, passwd])
                    logger.info('flush user={u} to mysql {s} errmsg={e}'.format(u=username,s=sqlResult['status'],e=sqlResult['result']))
                    if sqlResult['status'] == config.EXEC_SUCCESS:
                        Redis.delX(key)
                        return CommResult.HttpResult.format(200, 'Exec OK', {"code":200, "status": "Register OK"})
                    else:
                        return CommResult.HttpResult.format(200, 'Exec OK', {"code": 500, "status": "Internal Error"})
            else:
                logger.info('user={u} with identity_code={i} Register Failed invalid indentity_code'.format(u=username,i=identifying_code))
                return CommResult.HttpResult.format(200,'Exec OK', {"code":405, "status": "Incrrorect Identity Code"})
        elif result['status'] == config.QUERY_FALED:
            logger.info('user={u} identity_code={i} has been expired.'.format(u=username,i=identifying_code))
        return CommResult.HttpResult.format(200, 'Exec OK', {"code":405, "status" : "Register Failed."})
    pass

class IdentityModal(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('type', type=int)

    def get(self):
        data = self.parser.parse_args()
        username = data.get('name')
        type = data.get('type')

        identity_code  = self.get_random_number()

        ###
        # send identity code to the user
        # please in IDentityCode_TimeOut to update
        ###

        if type == 1:
            # Register Identity Code
            key = 'R' + username
            result = Redis.setX(key,identity_code, IDentityCode_TimeOut)
            if result['status'] == config.EXEC_FAILED:
                return CommResult.HttpResult.format(200, 'Exec OK', {"code": 405, "status": result['result']})
        elif type == 2:
            # forget password to Idenity Code
            key = 'F' + username
            result = Redis.setX(key, identity_code, IDentityCode_TimeOut)
            if result['status'] == config.EXEC_FAILED:
                return CommResult.HttpResult.format(200, 'Exec OK', {"code": 405, "status": result['result']})
        else:
            return CommResult.HttpResult.format(200, 'Exec OK', {"code": 403, "status": "UnResolved type."})

        logger.info("Get Identity code for {u} OK. identity code:{c} timeout:{t}".format(u=username, c=identity_code, t=IDentityCode_TimeOut))
        return CommResult.HttpResult.format(200, 'Exec OK',{"code":200,"status": "Identity Code has been sent."})

    def get_random_number(self) -> str:
        return random.randint(100000, 999999)
