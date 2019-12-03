from src.common import Redis,Mysql,Config,HashHelper,logger
from src.const import SQLFormatter as sql
import re
from urllib import parse
phone_pat = re.compile('^(13\d|14[5|7]|15\d|166|17[3|6|7]|18\d)\d{8}$')

def CheckLoginStatus(token:str, user:str)->bool:
    if not isinstance(token, str) or token == None or token == "":
        return False
    if not isinstance(user, str) or user == None or user == "":
        return False
    # Query user in Mysql valid
    dbresult = Mysql.MysqlHelper().query(sql.SQL_QUERY_ID_EXISTS,[user])
    if dbresult['status'] == Config.QUERY_FALED or dbresult['result'] is None:
        logger.info("{u}'s token is invalid.query in Mysql failed".format(u=user))
        return False
    user_id = dbresult['result'][0][0]
    # check the token is vaild or not
    message = HashHelper.Token.certify_token(Config.PROJECT_NAME, user, token)
    if message != "":
        logger.info("{u}'s token is invalid in verify token,{m}".format(u=user, m=message))
        return False
    # Query the Redis in here or not
    # 检查 此user 是否登录
    key = 'T' + user + str(user_id)
    dbresult = Redis.getX(key)
    if dbresult['status'] == Config.QUERY_FALED:
        logger.info("{u}'s token is invalid.query in Redis failed".format(u=user))
        return False
    # 检查登录的token是否与当前token 一致
    token_in_redis = dbresult['result']
    if token_in_redis != token:
        logger.info("{u}'s token is invalid".format(u=user))
        return False
    return True

def GetLoginUserId(user:str)->int:
    if not isinstance(user, str) or user == None or user == "":
        return -1
    # Query user in Mysql valid
    dbresult = Mysql.MysqlHelper().query(sql.SQL_QUERY_ID_EXISTS,[user])
    if dbresult['status'] == Config.QUERY_FALED or dbresult['result'] is None:
        logger.info("{u}'s token is invalid.query in Mysql failed".format(u=user))
        return -1
    return dbresult['result'][0][0]


def CheckTelValid(phone:str)->bool:
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
