import os

from flask import Flask


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY"),
        SQLALCHEMY_DATABASE_URI=os.environ.get("DATABASE_URL"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )
    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    return app
