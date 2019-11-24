from flask_restful import reqparse, abort, Api, Resource
from src.common import *

class RegisterModal(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('passwd', type=str)
        self.parser.add_argument('identifying_code', type=str)

    def get(self):
        data = self.parser.parse_args()
        username = data.get('name')
        passwd = data.get('passwd')
        identifying_code = data.get('identifying_code')
        if username == None or passwd == None or identifying_code == None:
            return CommResult.HttpResult.invalid_args()
        return CommResult.HttpResult.format(200, 'Exec OK', {"code":200, "status" : "Register OK."})


    pass