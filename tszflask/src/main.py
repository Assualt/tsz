#!/usr/bin/env python
# coding=utf-8
from datetime import timedelta
from functools import update_wrapper

from requests.compat import basestring

__author__ = "xhou"

from flask import Flask
from flask_restful import Api
from src.common import Config,logger
from src.Modal import LoginModal,RegisterModal,UserModal
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY']= Config.KEY

api = Api(app)

api.add_resource(LoginModal.LoginModal, '/login')
api.add_resource(RegisterModal.RegisterModal, '/register')
api.add_resource(RegisterModal.IdentityModal, '/verify')
api.add_resource(LoginModal.LoginOutModal, '/loginout')
api.add_resource(UserModal.UserInfo,'/insert')
api.add_resource(UserModal.GetUserInfo,'/getinfo')

if __name__ == '__main__':
    CORS(app)
    app.run(host="0.0.0.0",debug=True)
