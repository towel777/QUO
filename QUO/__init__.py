from flask import Flask


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE="",
    )

    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    return app
