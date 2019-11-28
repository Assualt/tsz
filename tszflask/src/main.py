#!/usr/bin/env python
# coding=utf-8
__author__ = "xhou"

from flask import Flask
from flask_restful import Api
from src.common import *
from src.Modal import *
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY']= config.KEY

api = Api(app)

api.add_resource(LoginModal.LoginModal, '/login')
api.add_resource(RegisterModal.RegisterModal, '/register')
api.add_resource(RegisterModal.IdentityModal, '/verify')
api.add_resource(LoginModal.LoginOutModal, '/loginout')
if __name__ == '__main__':
    logger.info("system SECRET_KEY:{k}".format(k=app.config["SECRET_KEY"]))
    app.run(host="0.0.0.0",debug=True)
