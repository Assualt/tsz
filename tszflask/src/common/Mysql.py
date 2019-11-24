import pymysql
from DBUtils.PooledDB import PooledDB
from .CommResult import *
from .config import *

DB_CONFIG = {
    'host' : MYSQL_HOST,
    'port' : MYSQL_PORT,
    'user' : MYSQL_USER,
    'passwd' : MYSQL_PASSWD,
    'db': MYSQL_DATABASE,
    'charset' : MYSQL_CHARSET,
    'maxconn' : MYSQL_MAX
}

class MysqlHelper(object):
    _pool_db = None

    def __init__(self):
        self._conn = MysqlHelper.get_connection()
        self._cursor = self._conn.cursor()
        pass

    @staticmethod
    def get_connection():
        if MysqlHelper._pool_db is None:
            _pool_db = PooledDB(pymysql,DB_CONFIG['maxconn'],host=DB_CONFIG['host'],user=DB_CONFIG['user'],
                               passwd=DB_CONFIG['passwd'],db=DB_CONFIG['db'],port=DB_CONFIG['port'],charset=DB_CONFIG['charset'])
        return _pool_db.connection()

    def query(self, sql, param=None) -> dict:
        if param is None:
            count = self._cursor.execute(sql)
        else:
            count = self._cursor.execute(sql, param)
        if count:
            result = self._cursor.fetchall()
            return DBResult.format(TSZ_MODEL_MYSQL, QUERY_SUCCESS, result)
        return DBResult.format(TSZ_MODEL_MYSQL, QUERY_FALED , None)


if __name__ == '__main__':
    my = MysqlHelper()
    id = 1001
    result = my.query("select * from tsz_user_pswd where user_id= '%s'", [id])
    print(result)