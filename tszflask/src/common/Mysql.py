import pymysql
from DBUtils.PooledDB import PooledDB
from src.common.CommResult import *
from src.common.Config import *

DB_CONFIG = {
    'host': MYSQL_HOST,
    'port': MYSQL_PORT,
    'user': MYSQL_USER,
    'passwd': MYSQL_PASSWD,
    'db': MYSQL_DATABASE,
    'charset': MYSQL_CHARSET,
    'maxconn': MYSQL_MAX
}


class MysqlHelper( object ):
    """
    mysql工具类,实现数据连操作,实现正常的增删改查功能
    """
    _pool_db = None

    def __init__(self):
        self._conn = MysqlHelper.get_connection()
        self._cursor = self._conn.cursor()
        pass

    @staticmethod
    def get_connection():
        global _pool_db
        if MysqlHelper._pool_db is None:
            _pool_db = PooledDB( pymysql, DB_CONFIG['maxconn'], host=DB_CONFIG['host'], user=DB_CONFIG['user'],
                                 passwd=DB_CONFIG['passwd'], db=DB_CONFIG['db'], port=DB_CONFIG['port'],
                                 charset=DB_CONFIG['charset'] )
        return _pool_db.connection()

    def query(self, sql, param=None) -> dict:
        try:
            if param is None:
                count = self._cursor.execute( sql )
            else:
                count = self._cursor.execute( sql, param )
            if count:
                result = self._cursor.fetchall()
                return DBResult.format( TSZ_MODEL_MYSQL, QUERY_SUCCESS, result )
            return DBResult.format( TSZ_MODEL_MYSQL, QUERY_FALED, None )
        except Exception as e:
            return DBResult.format( TSZ_MODEL_MYSQL, QUERY_FALED,
                                    "Catch Exception in MysqlHelper.query {e}".format( e=e ) )

    def insert(self, sql: str, param=None) -> dict:
        try:
            if param is None:
                count = self._cursor.execute( sql )
            else:
                count = self._cursor.execute( sql, param )
            self._conn.commit()
            if count:
                return DBResult.format( TSZ_MODEL_MYSQL, EXEC_SUCCESS, None )
            return DBResult.format( TSZ_MODEL_MYSQL, EXEC_FAILED, None )
        except Exception as e:
            return DBResult.format( TSZ_MODEL_MYSQL, EXEC_FAILED,
                                    "Catch Exception in MysqlHelper.insert {e}".format( e=e ) )

    def update(self, sql: str, param=None) -> dict:
        try:
            if param is None:
                count = self._cursor.execute( sql )
            else:
                count = self._cursor.execute( sql, param )
            self._conn.commit()
            if count:
                return DBResult.format( TSZ_MODEL_MYSQL, EXEC_SUCCESS, None )
            return DBResult.format( TSZ_MODEL_MYSQL, EXEC_FAILED, None );
        except Exception as e:
            return DBResult.format( TSZ_MODEL_MYSQL, EXEC_FAILED,
                                    "Catch Exception in MysqlHelper.query {e}".format( e=e ) )
        pass


if __name__ == '__main__':
    my = MysqlHelper()
    id = 1001
    result = my.query( "select * from tsz_user_pswd where user_id= '%s'", [id] )
    print( result )
    cont = my.insert( "insert into tsz_user_pswd(user_id,user_name,user_encrypt_pass) values(%s,%s,%s)",
                      [1002, "sunshine", "123456"] )
    print( cont )
