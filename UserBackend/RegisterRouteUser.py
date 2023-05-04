import os

import jwt
from bson import ObjectId
from flask import request, jsonify
from flask_cors import cross_origin

import settings
from auth_middleware import token_required
from model.User import Userv2Class


def registerRouteUser(app):



    @app.route("/user/forchat", methods=["GET"])
    @cross_origin()
    @token_required
    def userFchat(currentUser):
        rsFind = Userv2Class.getUserListForChat(currentUser.get("_id",""))
        return jsonify({
            "status": "ok",
            "message": "Get user list by name",
            "data": rsFind
        }), 200

    @app.route("/user/find/<name>", methods=["GET"])
    @cross_origin()
    def findUserByNamr(name):
        rsFind = Userv2Class.findUserByName(name)
        return jsonify({
            "status": "ok",
            "message": "Get user list by name",
            "data": rsFind
        }), 200

    @app.route("/user/changeName", methods=["POST"])
    @token_required
    @cross_origin()
    def changeName(current_user):
        data = request.json
        # "userId": 1,
        # "firstName": "Six",
        # "lastName": "Black"
        if "firstName" not in data or "lastName" not in data:
            return jsonify({
                "status": "err",
                "message": "Bad request",
                "data": None
            }),400
        rsChange = Userv2Class.updateName(current_user.get("_id",""),firstName=data.get("firstName"),lastName=data.get("lastName"))
        return jsonify({
            "status": "ok",
            "message": "successfully retrieved user profile",
            "data": rsChange
        })
    @app.route("/user/updateBackground", methods=["POST"])
    @token_required
    @cross_origin()
    def updateBackground(current_user):
        if not os.path.isdir(settings.UPLOADS_PATH):
            os.mkdir(settings.UPLOADS_PATH)
        if "file" in request.files:
            fileUp = request.files["file"]
            filename, file_extension = os.path.splitext(fileUp.filename)
            objID = current_user.get("_id", str(ObjectId()))
            path = os.path.join(settings.UPLOADS_PATH, f"background_{objID}{file_extension}")
            imgUrl = "{}/static/img/background_"
            imgUrl += str(objID)
            imgUrl += file_extension
            fileUp.save(path)
            rsUpdate = Userv2Class.updateBackground(current_user.get("_id", ""), imgUrl)
            return jsonify({
                "status": "ok",
                "message": "successfully update user profile",
                "data": rsUpdate
            })
        return jsonify({
            "status": "err",
            "message": "Bad request",
            "data": None
        }),400
    @app.route("/user/updateAvatar", methods=["POST"])
    @token_required
    @cross_origin()
    def updateAvatar(current_user):
        if not os.path.isdir(settings.UPLOADS_PATH):
            os.mkdir(settings.UPLOADS_PATH)
        if "file" in request.files:
            fileUp = request.files["file"]
            filename, file_extension = os.path.splitext(fileUp.filename)
            objID = current_user.get("_id",str(ObjectId()))
            path = os.path.join(settings.UPLOADS_PATH, f"avatar_{objID}{file_extension}")
            imgUrl = "{}/static/img/avatar_"
            imgUrl += str(objID)
            imgUrl += file_extension
            fileUp.save(path)
            rsUpdate = Userv2Class.updateAvatar(current_user.get("_id",""),imgUrl)
            return jsonify({
                "status": "ok",
                "message": "successfully update user profile",
                "data": rsUpdate
            })
        return jsonify({
            "status": "ok",
            "message": "Bad request",
            "data": None
        }), 400

    @app.route("/user/<id>", methods=["GET"])
    @cross_origin()
    def get_user_id(id):
        user = Userv2Class()
        res = user.get_user_by_id(id)
        print(res)
        return jsonify({
            "status": "ok",
            "message": "successfully retrieved user profile",
            "data": res
        })

    @app.route("/user", methods=["GET","POST"])
    @cross_origin()
    @token_required
    def get_current_user(current_user):
        return jsonify({
            "status": "ok",
            "message": "successfully retrieved user profile",
            "data": current_user
        })

    @app.route("/user/register", methods=["POST"])
    @cross_origin()
    def createUser():
        userdata = request.json
        if "firstName" not in userdata or "lastName" not in userdata or "email" not in userdata or "phone" not in userdata or "password" not in userdata:
            return {
                       "status": "fail",
                       "message": "Please provide user details",
                       "data": None,
                       "error": "Bad request"
                   }, 400
        usr = Userv2Class()
        if usr.checkEmailExist(userdata.get("email")):
            return {
                       "status": "fail",
                       "message": "Email exist",
                       "data": None,
                       "error": "Bad request"
                   }, 409
        usr.__int__(firstName=userdata.get("firstName", ""), lastName=userdata.get("lastName", ""),
                    email=userdata.get("email"), phone=userdata.get("phone", "0000000000"),
                    password=userdata.get("password", ""))
        res = usr.createUser()
        res["_id"] = str(res.get("_id", ""))
        if res:
            print(res)
            return {
                       "status": "ok",
                       "message": "Successfully created new user",
                       "data": res
                   }, 201
        else:
            return {
                       "status": "error",
                       "message": "created new user fail",
                       "data": None
                   }, 500

    @app.route("/user/login", methods=["POST"])
    @cross_origin()
    def login():
        try:
            data = request.json
            print(data)
            if data == None:
                return {
                           "message": "Please provide user details",
                           "data": None,
                           "error": "Bad request"
                       }, 400
            # validate input
            usr = Userv2Class()
            is_validated = usr.validate_email_and_password(username=data.get('username'), password=data.get('password'))
            print(data)
            if is_validated == False:
                return dict(message='Invalid data', data=None, error=is_validated), 400
            user = usr.login(
                data["username"],
                data["password"]
            )
            if user:
                try:
                    # token should expire after 24 hrs
                    user["token"] = jwt.encode(
                        {"_id": user["_id"]},
                        app.config["SECRET_KEY"],
                        algorithm="HS256"
                    )
                    return {
                        "status": "ok",
                        "message": "Successfully fetched auth token",
                        "data": user
                    }
                except Exception as e:
                    return {
                               "status": "fail",
                               "error": "Something went wrong",
                               "message": str(e)
                           }, 500
            return {
                       "status": "fail",
                       "message": "Error fetching auth token!, invalid email or password",
                       "data": None,
                       "error": "Unauthorized"
                   }, 404
        except Exception as e:
            return {
                       "status": "fail",
                       "message": "Something went wrong!",
                       "error": str(e),
                       "data": None
                   }, 500