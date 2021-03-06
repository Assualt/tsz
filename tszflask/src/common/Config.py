import os
# PROJECT_NAME
PROJECT_NAME = "tsz"

# SERVER SETTINGS
SERVER_HOST = '127.0.0.1'
SERVER_PORT = '5000'
SERVER_LOG = '/home/xhou/work/GitRepository/tsz/tszflask/logs/server.log'

# REDIS
REDIS_URL    = "127.0.0.1"
REDIS_PASSWD = "123456"
REDIS_PORT   = 6379
REDIS_TIMEOUT = 10

# MYSQL
MYSQL_HOST = "127.0.0.1"
MYSQL_PORT = 3306
MYSQL_USER = "root"
MYSQL_PASSWD = "123456"
MYSQL_DATABASE = "tsz"
MYSQL_CHARSET = "utf8"
MYSQL_MAX = 20

# MODEL_ID
TSZ_MODEL_MYSQL = 10001
TSZ_MODEL_REDIS = 10002
TSZ_MODEL_SERVER = 10000

#SQL EXEC Result
QUERY_FALED = "Query Failed"
QUERY_SUCCESS = "Query Success"
EXEC_SUCCESS = "Exec Success"
EXEC_FAILED = "Exec Failed"

KEY = os.urandom(16)


#LOGIN
LOGIN_TIME_OUT = 3600 * 24


Genders = [
    "男",
    "女",
    "保密"
]
def getIndex(sex):
    if sex == '男':
        return 0
    elif sex == '女':
        return 1
    elif sex == '保密':
        return 2
    return 2