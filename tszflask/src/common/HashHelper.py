import hashlib
import base64
from Crypto.Cipher import AES
md5_utils = hashlib.md5()
sha1_utils = hashlib.sha1()
sha256_utils = hashlib.sha256()
sha512_utils = hashlib.sha512()

def md5(data, encoding = 'utf-8') -> str:
    if len(data) == 0:
        return ""
    try:
        md5_utils.update(data.encode(encoding))
        md5_encode = md5_utils.hexdigest()
    except Exception as e:
        raise ValueError("Calc Md5 Error. ErrMsg:{exp}".format(exp=e))
    return md5_encode

def sha1(data, encoding = 'utf-8') -> str:
    if len(data) == 0:
        return ""
    try:
        sha1_utils.update(data.encode(encoding))
        sha1_encode = sha1_utils.hexdigest()
    except Exception as e:
        raise ValueError("calc sha1 error. err msg:{exp}".format(exp=e))
    return sha1_encode

def sha256(data, encoding = 'utf-8') -> str:
    if len(data) == 0:
        return ""
    try:
        sha256_utils.update(data.encode(encoding))
        sha256_encode = sha256_utils.hexdigest()
    except Exception as e:
        raise ValueError("calc sha256 error. err msg:{exp}".format(exp=e))
    return sha256_encode

def sha512(data, encoding = 'utf-8') -> str:
    if len(data) == 0:
        return ""
    try:
        sha512_utils.update(data.encode(encoding))
        sha512_encode = sha512_utils.hexdigest()
    except Exception as e:
        raise ValueError("calc sha512 error. err msg:{exp}".format(exp=e))
    return sha512_encode

def base64decode(data) -> str:
    if not len(data):
        return ""
    try:
        return str(base64.b64decode(data))
    except Exception as e:
        raise ValueError("decoded base64 error. err msg:{exp}".format(exp=e))

def base64encode(data, encoding = 'utf-8') -> str:
    if not len(data):
        return ""
    try:
        return base64.b64encode(bytes(data, encoding=encoding))
    except Exception as e:
        raise ValueError("encoded base64 error. err msg:{exp}".format(exp=e))


class Token(object):
    @staticmethod
    def get_token(key, PROJECT_NAME, login_time, account) -> str:
        chiper = AES.new(key, AES.MODE_EAX)
        tmp = PROJECT_NAME + ";"  + login_time + ";" + account
        s_token = chiper.encrypt(str.encode(tmp))
        return str(base64encode(str(s_token)))

if __name__ == '__main__':
    try:
        print(md5("123"))
        print(md5("123","gb2312"))
        print(sha1("123"))
        print(sha256("123"))
        print(sha512("123"))
        print(base64encode("123@.com"))
        print(base64decode(base64encode("123@.com")))
        import os
        KEY = bytes(os.urandom(16))
        print(Token.get_token(KEY, "123456", "123213", "admin@p.cn"))

    except Exception as e:
        print("e", e)
