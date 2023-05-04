import logging

from bson import ObjectId
from flask import request
from db import db


class Userv2Class:
    def __int__ (self, _id: str = "", firstName: str = "", lastName: str = "",
                 avatar: str = "",
                 background: str = "",
                 email: str = "",
                 password: str = "",
                 name: str = "",
                 phone: str = "",
                 token: str = "",
                 dateCreate: str = "",
                 follow: int = 0) -> None:
        self._id = _id
        self.firstName = firstName
        self.lastName = lastName
        self.avatar = avatar
        self.background = background
        self.email = email
        self.password = password
        self.name = name
        self.phone = phone
        self.token = token
        self.dateCreate = dateCreate
        self.follow = follow

    @classmethod
    def getUserListForChat(cls,userid):
        users = list(db["user"].find({"_id":{"$ne":ObjectId(userid)}}, {"name": 1, "avatar": 1, "dateCreate": 1}))
        for user in users:
            user = cls.parserUserImage(user)
            user["_id"] = str(user.get("_id"))
            user["userId"] = str(user.get("_id"))
        return users

    @classmethod
    def parserUserImage(cls,data):
        if "{}" in data.get("avatar", ""):
            data["avatar"] = data.get("avatar", "").format(request.host_url)
        if "{}" in data.get("background", ""):
            data["background"] = data.get("background", "").format(request.host_url)
        return data

    @classmethod
    def getBaseInfo(cls, userId):
        user = db["user"].find_one({"_id":ObjectId(userId)},{"name":1,"avatar":1,"dateCreate":1})
        user = cls.parserUserImage(user)
        user["_id"] = str(user.get("_id"))
        user["userId"] = str(user.get("_id"))
        return user

    @classmethod
    def checkEmailExist(cls,email):
        rs = db["user"].find_one({"email":email})
        if rs:
            return True
        else:
            return False

    @classmethod
    def updateAvatar(self,id,avatarPath):
        db["user"].update_many({"_id":ObjectId(id)},{"$set":{"avatar":avatarPath}})
        return id

    @classmethod
    def updateName(self, id, lastName,firstName):
        db["user"].update({"_id": ObjectId(id)}, {"$set":{"lastName": lastName,"firstName":firstName,"name":f"{firstName} {lastName}"}})
        return id

    @classmethod
    def updateBackground(self, id, backgroundPath):
        db["user"].update({"_id": ObjectId(id)}, {"$set":{"background": backgroundPath}}, upsert=False)
        return id

    def createUser(self):
        try:
            userObj = {"firstName": self.firstName,
                       "lastName": self.lastName,
                       "avatar": self.avatar,
                       "background": self.background,
                       "email": self.email,
                       "password": self.password,
                       "name": self.name,
                       'phone': self.phone,
                       "dateCreate": self.dateCreate,
                       'follow': self.follow,
                       "active": True}
            db["user"].insert_one(userObj)
            return userObj
        except Exception as e:
            print(e)
            logging.exception(e)
            return None

    def validate_email_and_password(self, username, password):
        user = db["user"].find_one({"email": username, "password": password}, {"password": 0}) or None
        if user is not None:
            user["_id"] = str(user.get("_id"))
            return user.get("active", False)
        return False

    def login(self, username: str = "", password: str = ""):
        user = db["user"].find_one({"email": username, "password": password}, {"password": 0}) or None
        if user is not None:
            user["_id"] = str(user.get("_id"))
            user["userId"] = str(user.get("_id"))
            if "{}" in user.get("avatar",""):
                user["avatar"] = user.get("avatar","").format(request.host_url)
                user["background"] = user.get("background","").format(request.host_url)
        return user

    @classmethod
    def findUserByName(cls,name):
        users = list(db["user"].find({"$or":[{"lastName": {"$regex":name}},{"name":{"$regex":name}}]}, {"password": 0}))
        for user in users:
            if user is not None:
                user["_id"] = str(user.get("_id"))
                user["userId"] = str(user.get("_id"))
                if "{}" in user.get("avatar", ""):
                    user["avatar"] = user.get("avatar", "").format(request.host_url)
                    user["background"] = user.get("background", "").format(request.host_url)
        return users

    @classmethod
    def get_user_by_id(cls, id):
        user = db["user"].find_one({"_id": ObjectId(id)}, {"password": 0}) or None
        if user is not None:
            user["_id"] = str(user.get("_id"))
            user["userId"] = str(user.get("_id"))
            if "{}" in user.get("avatar",""):
                user["avatar"] = user.get("avatar","").format(request.host_url)
                user["background"] = user.get("background","").format(request.host_url)
        return user
