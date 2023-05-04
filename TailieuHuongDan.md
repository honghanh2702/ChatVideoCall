# Hướng dẫn cài đặt
## Cài đặt Docker
Truy cập đường dẫn https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=module
## Cài đặt nodeJS
Truy cập đường dẫn https://nodejs.org/en/ tải và cài đặt NodeJS
## Cài đặt Python
Truy cập đường link https://www.python.org/ tải và cài đặt Python
## Cài đặt MongoDB
```
$ cd UserBackend
$ docker compose up -d
```
- Truy cập đường dẫn http://localhost:8081
- Kết quả
![img_1.png](img_1.png)
## Cài đặt Frontend
- Cài đặt thư viện 
```
$ cd frontend
$ npm install
```
- Khởi chạy Frontend
```
$ npm start
```
## Cài đặt Socket Server
- Cài đặt thư viện 
```
$ cd backend
$ npm install
```
- Khởi chạy Socket Server
```
$ node index.js
```
 ## Cài đặt UserBackend
- Cài đặt thư viện 
```
$ cd UserBackend
$ pip install flask flask_compress flask_cors pymongo
```
- Khởi chạy UserBackend
```
$ python main.py
```
## Kết quả
- Truy cập đường dẫn http://localhost:3000
![img.png](img.png)