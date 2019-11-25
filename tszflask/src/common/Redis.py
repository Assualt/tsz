import redis
import time
import datetime
from src.common import logger
from src.common.config import REDIS_URL, REDIS_PASSWD, REDIS_PORT, TSZ_MODEL_REDIS, REDIS_TIMEOUT,QUERY_FALED,QUERY_SUCCESS,EXEC_FAILED,EXEC_SUCCESS
from src.common.CommResult import DBResult
redis_pool = redis.ConnectionPool(host=REDIS_URL, port=REDIS_PORT,password=REDIS_PASSWD)

def get_redis():
    return redis.Redis(connection_pool=redis_pool, socket_timeout= REDIS_TIMEOUT)

def setX(key,val, expire_time = 3600 * 24) -> dict:
    try:
        redis_cli = get_redis()
        if redis_cli.set(key, val):
            redis_cli.expire(key, expire_time)
            logger.info("set {key} expiretime:{expire}".format(key=key, expire=datetime.datetime.fromtimestamp(int(time.time()) + expire_time)))
            return DBResult.format(TSZ_MODEL_REDIS, EXEC_SUCCESS, None)
        else:
            logger.info("set {key} into redis failed".format(key=key))
            return DBResult.format(TSZ_MODEL_REDIS, EXEC_FAILED , None)
        pass
    except Exception as e:
        errmsg = "Catch Execption in Redis setX({key},{val}). ErrMsg:{msg}".format(key=key,val=val,msg=e)
        logger.warning(errmsg)
        return DBResult.format(TSZ_MODEL_REDIS, EXEC_FAILED, errmsg)

def getX(key, expire_time = 3600 * 24, update = False) -> dict:
    try:
        redis_cli = get_redis()
        val = redis_cli.get(key)
        if None != val and update:
            redis_cli.expire(key, expire_time)
            logger.debug("set {key} expiretime:{expire}".format(key=key, expire=datetime.datetime.fromtimestamp(int(time.time())+expire_time)))
        return DBResult.format(TSZ_MODEL_REDIS, QUERY_SUCCESS, val)
    except Exception as e:
        errmsg = "Catch Execption in Redis getX({key}). ErrMsg:{msg}".format(key=key, msg=e)
        logger.warning(errmsg)
        return DBResult.format(TSZ_MODEL_REDIS, QUERY_FALED, errmsg)

def delX(key)->dict:
    try:
        redis_cli = get_redis()
        redis_cli.delete(key)
        return DBResult.format(TSZ_MODEL_REDIS, EXEC_SUCCESS, None)
    except Exception as e:
        errmsg = "Catch Execption in Redis getX({key}). ErrMsg:{msg}".format(key=key, msg=e)
        logger.warning(errmsg)
        return DBResult.format(TSZ_MODEL_REDIS, EXEC_FAILED, errmsg)
    pass

if __name__ == '__main__':
    setX("Redis","Test",5)
    logger.info("get key:{val} currentTime:{t1}".format(val=getX("Redis", 5), t1=datetime.datetime.fromtimestamp(int(time.time()))))
    time.sleep(3)
    logger.info("get key:{val} currentTime:{t1}".format(val=getX("Redis", 5), t1=datetime.datetime.fromtimestamp(int(time.time()))))
    time.sleep(5)
    logger.info("get key:{val} currentTime:{t1}".format(val=getX("Redis", 5), t1=datetime.datetime.fromtimestamp(int(time.time()))))