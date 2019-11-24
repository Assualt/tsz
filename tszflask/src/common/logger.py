import logging as log
from .config import SERVER_LOG

logger = log.getLogger()
logger.setLevel(log.DEBUG)

fh = log.FileHandler(SERVER_LOG, encoding='utf-8')
ch = log.StreamHandler()


formatter = log.Formatter(
    fmt="T:(%(thread)s)%(asctime)s[%(name)s-%(levelname)s] %(message)s",
    datefmt="(%Y-%m-%d %H:%M:%S %a)"
)
fh.setFormatter(formatter)
ch.setFormatter(formatter)

logger.addHandler(fh)
logger.addHandler(ch)

def info(message):
    logger.info(message)

def error(message):
    logger.error(message)

def warning(message):
    logger.warning(message)

def debug(message):
    logger.debug(message)
def critical(message):
    logger.critical(message)

if __name__ == '__main__':
    debug("123")
