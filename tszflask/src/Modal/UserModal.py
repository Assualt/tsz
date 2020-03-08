from flask_restful import reqparse, Resource
from src.common import CommResult,Config,HttpStatus,AppStatus,Mysql,Redis,logger,HashHelper
from . import CommonCheck
from src.const import SQLFormatter as sql
from src.sqlbean.TszUser import convert_to_tsz_user

class UserInfo(Resource):
    """
    用户的基本信息
    :param s_token: 上传的token_md5值
    :param s_user:  上传用户的姓名
    :param s_nichen: 上传用户的昵称
    :param s_sex:   上传用户的性别
    :param s_uni:   上传用户的所在学校
    :param s_desc:  上传用户的详细介绍
    :param s_age:   上传用户的年龄
    :param s_tel:   上传用户的电话
    :param s_addr:  上传用户的地址
    """
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
        check_ok, message = CommonCheck.CheckLoginStatus(s_token, s_user)
        if not check_ok:
            return CommResult.HttpResult.user_not_login()
        # get user_id
        s_user_id = CommonCheck.GetLoginUserId(s_user)
        dbresult = Mysql.MysqlHelper().insert(sql.SQL_INSERT_TSZ_USER,[
            s_user_id, s_user, s_nichen, s_uni, s_desc, s_addr,
            0, '', s_tel, s_sex, s_age
        ])
        if dbresult['status'] == Config.EXEC_SUCCESS:
            logger.info("insert user.status {u} ok".format(u=s_user))
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE,
                                                AppStatus.APP_200_OK, "OK")
        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE,
                                            AppStatus.APP_300_BAD_RESULT, dbresult['result'])

class GetUserInfo(Resource):
    """
    获取用户的详细信息 包含用户的基本信息
    :param s_token: 用户的cookie的md5值
    :param s_user : 用户的登录名存在于Redis里面
    """
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

        check_ok, message = CommonCheck.CheckLoginStatus( s_token, s_user )
        if not check_ok:
            return CommResult.HttpResult.user_not_login()

        # select data from mysql and write
        s_user_id = CommonCheck.GetLoginUserId( s_user )
        dbresult = Mysql.MysqlHelper().query(sql.SQL_QUERY_TSZ_USER, [s_user_id])
        if dbresult['status'] == Config.QUERY_FALED or not dbresult['result']:
            return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_MESSAGE,
                                                AppStatus.APP_400_BAD_REQUEST, "user id not found!")
        query_result = dbresult['result'][0]
        retdict = convert_to_tsz_user(query_result)
        return CommResult.HttpResult.format(HttpStatus.HTTP_200_OK, HttpStatus.HTTP_200_OK,
                                            AppStatus.APP_200_OK, retdict)

class GetUserCarts(Resource):
    """
    获取用户的购物车详细数据
    :param s_token: 用户的token
    :param s_user:  用户名
    :param s_filter:  类型 0.所有信息 1.购物车 2.已购买 3.待支付 4.已付款待配送 5.已付款运输中
    """
    def __init__(self):
        self.parser=reqparse.RequestParser()
        self.parser.add_argument('s_token', type=str)
        self.parser.add_argument('s_user', type=str)
        self.parser.add_argument('s_filter', type=int)

    def get(self)->dict:
        return CommResult.HttpResult.unsupported_method()

    def post(self)->dict:
        data = self.parser.parse_args()
        s_token = data.get( 's_token', None )
        s_user = data.get( 's_user', None )
        s_filter = data.get('s_filter', None)
        if not s_token or not s_user or not s_filter:
            return CommResult.HttpResult.invalid_args()
        check_ok, message = CommonCheck.CheckLoginStatus(s_token, s_user)
        if not check_ok:
            return CommResult.HttpResult.user_not_login()
        return CommResult.HttpResult.user_not_login()