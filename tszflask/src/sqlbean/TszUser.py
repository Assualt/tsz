from src.common import Config
class TszUser(object):
    __attributes__ = ['id','name','nichen','uni','desc','address','addIndex','otheraddIndex','phone','sex','age']
    
    def __init__(self):
        pass

    def __setattr__(self, key, val):
        if key in self.__attributes__:
            self.__dict__[key] = val

    def get_dict(self):
        return self.__dict__

    @staticmethod
    def Convert2_tsz_user_method(id,name,nichen,uni,desc,address,addIndex,otherIndex,phone,sex,age)->dict:
        tmp = TszUser()
        tmp.id = id
        tmp.name = name
        tmp.nichen = nichen
        tmp.uni = uni
        tmp.desc = desc
        tmp.address = address
        tmp.addIndex = addIndex
        tmp.otheraddIndex = otherIndex
        tmp.phone = phone
        tmp.sex = Config.getIndex(sex)
        tmp.age = age
        return tmp.get_dict()


def convert_to_tsz_user(r:list)->dict:
    return TszUser.Convert2_tsz_user_method(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10])


if __name__ == "__main__":    
    temp = [1,2,3,4,5,6,7,8,9,10,11]
    print(convert_to_tsz_user(temp))

    
