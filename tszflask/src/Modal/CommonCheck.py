from src.common import Redis,Mysql,Config,HashHelper,logger
from src.const import SQLFormatter as sql
import re
from urllib import parse
phone_pat = re.compile('^(13\d|14[5|7]|15\d|166|17[3|6|7]|18\d)\d{8}$')

def CheckLoginStatus(token:str, user:str)->(bool, str):
    """
    检查用户的登录状态
    :param token: 用户token
    :param user:  用户名
    :return: 状态:处理结果
    """
    if not isinstance(token, str) or token == None or token == "":
        return False,"Argument is invalid"
    if not isinstance(user, str) or user == None or user == "":
        return False,"Argument is invalid"
    # 1.从mysql获取用户唯一ID
    dbresult = Mysql.MysqlHelper().query(sql.SQL_QUERY_ID_EXISTS,[user])
    if dbresult['status'] == Config.QUERY_FALED or not dbresult['result']:
        logger.info("{u}'s token is invalid.query in Mysql failed".format(u=user))
        return False,"id is invalid. Query Failed"
    user_id = dbresult['result'][0][0]
    # 2.从Reids中获取全量token
    key = 'T' + user + str( user_id )
    dbresult = Redis.getX( key )
    if dbresult['status'] == Config.QUERY_FALED or not dbresult['result']:
        logger.info( "{u}'s token is invalid.query in Redis failed".format( u=user ) )
        return False,"current User not logined."
    token_in_redis = dbresult['result']
    # 3.检验token
    if token != HashHelper.hash_md5( token_in_redis ):
        logger.info("{u}'s token is invalid.HashChek Failed".format(u=user))
        return False,"token hash check failed"
    # 4.校验用户的token的合法性,一个用户对应一个token
    message = HashHelper.Token.certify_token(Config.PROJECT_NAME, user, token)
    if message != "":
        logger.info("{u}'s token is invalid in verify token,{m}".format(u=user, m=message))
        return False,"token is valid. not belong {u}".format(u=user)
    return True,"SUCCESS"

def GetLoginUserId(user:str)->(int,str):
    """
    根据用户ID查看用户是否存在,并返回用户唯一标识ID
    :param user: 用户姓名
    :return: Success:返回用户的唯一标识ID Failed: -1
    """
    if not isinstance(user, str) or user == None or user == "":
        return -1,"USER Argument is invalid"
    # Query user in Mysql valid
    dbresult = Mysql.MysqlHelper().query(sql.SQL_QUERY_ID_EXISTS,[user])
    if dbresult['status'] == Config.QUERY_FALED or dbresult['result'] is None:
        logger.info("query {u} ID in Mysql failed".format(u=user))
        return -1,"Query {u} ID in mysql failed".format(u=user)
    return dbresult['result'][0][0],"SUCCESS"


def CheckTelValid(phone:str)->bool:
    """
    检查telphone 是不是符合规范
    :param phone:用户的点好号码
    :return: Success:True Failed: False
    """
    try:
        res = re.search(phone_pat, phone)
        if res:
            return True
        else:
            return False
    except Exception:
        return False

def JsonEncoded(strdict:dict)->str:
    return parse.urlencode(strdict)


if __name__ == '__main__':
    CheckLoginStatus("123123", "admin@p.cn")
    print(CheckLoginStatus("MTU3NTcxMjQ1My42ODQ3MDg2OjZiZDliNmU3ZDEwZjAwODFlZTFmNzM3OTRjYjc3Mjg4ZjI5N2U0N2M6YWRtaW5AcC5jbg==","admin@p.cn"))
