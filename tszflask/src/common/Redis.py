import redis
import time
import datetime
from . import logger
from .config import REDIS_URL, REDIS_PASSWD, REDIS_PORT, TSZ_MODEL_REDIS
from .CommResult import DBResult
redis_pool = redis.ConnectionPool(host=REDIS_URL, port=REDIS_PORT,password=REDIS_PASSWD)

def get_redis():
    return redis.Redis(connection_pool=redis_pool)

def setX(key,val, expire_time = 3600 * 24) -> dict:
    try:
        redis_cli = get_redis()
        if redis_cli.set(key, val):
            redis_cli.expire(key, expire_time)
            logger.info("set {key} expiretime:{expire}".format(key=key, expire=datetime.datetime.fromtimestamp(int(time.time()) + expire_time)))
            return DBResult.format(TSZ_MODEL_REDIS, "Set OK", True)
        else:
            logger.info("set {key} into redis failed".format(key=key))
            return DBResult.format(TSZ_MODEL_REDIS, "Set Failed", False)
        pass
    except Exception as e:
        errmsg = "Catch Execption in Redis setX({key},{val}). ErrMsg:{msg}".format(key=key,val=val,msg=e)
        logger.warning(errmsg)
        return DBResult.format(TSZ_MODEL_REDIS, errmsg, False)

def getX(key, expire_time = 3600 * 24) -> dict:
    try:
        redis_cli = get_redis()
        val = redis_cli.get(key)
        if None != val:
            redis_cli.expire(key, expire_time)
            logger.debug("set {key} expiretime:{expire}".format(key=key, expire=datetime.datetime.fromtimestamp(int(time.time())+expire_time)))
        return DBResult.format(TSZ_MODEL_REDIS, "Query OK", val)
    except Exception as e:
        errmsg = "Catch Execption in Redis getX({key}). ErrMsg:{msg}".format(key=key, msg=e)
        logger.warning(errmsg)
        return DBResult.format(TSZ_MODEL_REDIS, errmsg, None)

if __name__ == '__main__':
    setX("Redis","Test",5)
    logger.info("get key:{val} currentTime:{t1}".format(val=getX("Redis", 5), t1=datetime.datetime.fromtimestamp(int(time.time()))))
    time.sleep(3)
    logger.info("get key:{val} currentTime:{t1}".format(val=getX("Redis", 5), t1=datetime.datetime.fromtimestamp(int(time.time()))))
    time.sleep(5)
    logger.info("get key:{val} currentTime:{t1}".format(val=getX("Redis", 5), t1=datetime.datetime.fromtimestamp(int(time.time()))))