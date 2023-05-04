import settings
from app import app

if __name__ == '__main__':
    app.run(host=settings.FLASK_HOST,port=settings.FLASK_PORT, debug=True)