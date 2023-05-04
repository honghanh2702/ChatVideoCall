import pymongo

import settings as settings


# mongoClient = pymongo.MongoClient(
#     f"mongodb://{settings.MONGO_USER}:{settings.MONGO_PASSWORD}"
#     f"@{settings.MONGO_HOST}:{settings.MONGO_PORT}/?authSource=admin"
# )
def init_db_connection():
    con_str = (
        f"mongodb://{settings.MONGO_USER}:{settings.MONGO_PASSWORD}"
        f"@{settings.MONGO_HOST}:{settings.MONGO_PORT}/?authSource=admin"
    )
    mongoClient = pymongo.MongoClient(con_str)
    db = mongoClient["videocall"]
    return db, mongoClient

def init_col(db):
    cols = ["user"]
    for col in cols:
        if col not in db.list_collection_names():
            db.create_collection(col)

db, mongoClient = init_db_connection()
init_col(db)
def wrap_db_connection(func):
    def wrapper_function(*args, **kwargs):
        db, mongoClient = init_db_connection()
        if "db" in kwargs:
            kwargs.pop("db")
        result = func(*args, db=db, **kwargs)
        mongoClient.close()
        return result

    return wrapper_function