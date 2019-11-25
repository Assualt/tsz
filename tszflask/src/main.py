#!/usr/bin/env python
# coding=utf-8
__author__ = "xhou"

from flask import Flask
from flask_restful import Api
from src.common import *
from src.Modal import *
import os

app = Flask(__name__)

app.config['SECRET_KEY']=os.urandom(24)

api = Api(app)

api.add_resource(LoginModal.LoginModal, '/login')
api.add_resource(RegisterModal.RegisterModal, '/register')
api.add_resource(RegisterModal.IdentityModal, '/verify')
if __name__ == '__main__':
    logger.info("system SECRET_KEY:{k}".format(k=app.config["SECRET_KEY"]))
    app.run(debug=True)
