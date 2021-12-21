from flask import Flask


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI="postgresql+psycopg2://app_client:admin@localhost:5432/QUO_test_db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )
    from . import db
    db.init_app(app)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    return app
