import os

from flask import Flask


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    # # This will allow you to connect to Heroku Postgres services using SQLAlchemy >= 1.4.x
    # uri = os.getenv("DATABASE_URL")  # or other relevant config var
    # if uri.startswith("postgres://"):
    #     uri = uri.replace("postgres://", "postgresql://", 1)

    app.config.from_mapping(
        SECRET_KEY="dev",
        SQLALCHEMY_DATABASE_URI="postgresql+psycopg2://app_client:admin@localhost:5432/QUO_test_db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )
    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import task
    app.register_blueprint(task.bp)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    return app
