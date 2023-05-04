import logging
from flask import Flask, request, jsonify
import flask
import settings
from flask_compress import Compress
# from Utils.SQL_Helper import initDB
# from registerRoute import registerRoute
from RegisterRouteUser import registerRouteUser
# from RegisterRoutePost import registerPostRoute
# from RegisterRouteFollow import registerRouteFollow
from flask_cors import CORS

logging.basicConfig(format='%(asctime)s %(message)s %(levelname)s:%(message)s', level=logging.DEBUG)

app = Flask(__name__)
app.config['SECRET_KEY'] = settings.SECRET_KEY
Compress(app)
CORS(app)
# initDB()
# registerRoute(app)
registerRouteUser(app)
# registerPostRoute(app)
# registerRouteFollow(app)
