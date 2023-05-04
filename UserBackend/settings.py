from os import getenv
import os
from os.path import join, dirname, realpath
FLASK_HOST = getenv("FLASK_HOST","0.0.0.0")
FLASK_PORT = int(getenv("FLASK_PORT",5005))
MONGO_HOST = getenv("MONGO_HOST", "localhost")
MONGO_PORT = int(getenv("MONGO_PORT", 27017))
MONGO_USER = getenv("MONGO_USER", "root")
MONGO_PASSWORD = getenv("MONGO_PASSWORD", "admin123")

UPLOADS_PATH = join(dirname(realpath(__file__)), 'static/img')
SECRET_KEY = getenv("SECRET_KEY","2a02d7e3820f39ca37506681488e77ba")
STATIC_PATH = join(dirname(realpath(__file__)), 'static')
print(UPLOADS_PATH)

if not os.path.isdir(STATIC_PATH):
    os.mkdir(STATIC_PATH)

if not os.path.isdir(UPLOADS_PATH):
    os.mkdir(UPLOADS_PATH)
