from flask_restful import reqparse, Resource
from src.common import CommResult,Config,HttpStatus,AppStatus,Mysql,Redis,logger
from . import CommonCheck
from src.const import SQLFormatter as sql
from src.sqlbean.TszUser import Convert2_tsz_user
from datetime import datetime


class UserInfo(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('s_token', type=str)  # Token
        self.parser.add_argument('s_user', type=str)   # user
        self.parser.add_argument('s_nichen', type=str) # 昵称
        self.parser.add_argument('s_sex', type=str)    # 性别
        self.parser.add_argument('s_uni', type=str)    # 学校
        self.parser.add_argument('s_desc', type=str)   # 详细介绍
        self.parser.add_argument('s_age', type=str)    # 年龄
        self.parser.add_argument('s_tel', type=str)    # 电话号码
        self.parser.add_argument('s_addr', type=str)   # 地址

    def get(self)->dict:
        return CommResult.HttpResult.unsupported_method()

    def post(self)->dict:
        data = self.parser.parse_args()
        s_token = data.get('s_token', '')
        s_user = data.get('s_user','')
        if not s_token or not s_user:
            return CommResult.HttpResult.invalid_args()

        s_tel = data.get('s_tel','')
        s_sex = data.get('s_sex', '')
        try:
            s_sex = Config.Genders[int(s_sex)]
        except ValueError:
            s_sex = Config.Genders[2]
        if not CommonCheck.CheckTelValid(s_tel):
            return CommResult.HttpResult.invalid_args()

        s_nichen = data.get('s_nichen', '')
        s_uni = data.get('s_uni', '')
        s_desc = data.get('s_desc','')
        s_age = data.get('s_age','')
        
        s_addr = data.get('s_addr','')
        
        # check the user is login or not
        if not CommonCheck.CheckLoginStatus(s_token, s_user):
            return CommResult.HttpResult.user_not_login()
        # get user_id
        s_user_id = CommonCheck.GetLoginUserId(s_user)
        dbresult = Mysql.MysqlHelper().insert(sql.SQL_INSERT_TSZ_USER,[
            s_user_id, s_user, s_nichen, s_uni, s_desc, s_addr,
            0, '', s_tel, s_sex, s_age
        ])
        if dbresult['status'] == Config.EXEC_SUCCESS:
            logger.info("insert user.status {u} ok".format(u=s_user))
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK,HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_200_OK, "OK")
        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_300_BAD_RESULT, dbresult['result'])

class GetUserInfo(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('s_token', type=str)  # Token
        self.parser.add_argument('s_user', type=str)   # user
        pass

    def get(self)->dict:
        return CommResult.HttpResult.unsupported_method()

    def post(self)->dict:
        data = self.parser.parse_args()
        s_token = data.get('s_token', '')
        s_user = data.get('s_user','')
        if not s_token or not s_user:
            return CommResult.HttpResult.invalid_args()

        # Check Login Status
        if not CommonCheck.CheckLoginStatus(s_token, s_user):
            return CommResult.HttpResult.user_not_login()
        
        # Get User ID
        s_user_id = CommonCheck.GetLoginUserId(s_user)

        dbresult = Mysql.MysqlHelper().query(sql.SQL_QUERY_TSZ_USER, [s_user_id])
    
        if dbresult['status'] == Config.QUERY_FALED or not dbresult['result']:
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE, AppStatus.APP_500_INTERNAL_ERROR, AppStatus.APP_500_MESSAGE)
        query_result = dbresult['result'][0]

        retdict = Convert2_tsz_user(query_result)

        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK,HttpStatus.HTTP_200_OK, AppStatus.APP_200_OK, retdict )        



