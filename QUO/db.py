from flask_sqlalchemy import SQLAlchemy

import click
from flask.cli import with_appcontext

db = SQLAlchemy()


def init_app(app):
    db.init_app(app)
    app.cli.add_command(init_db_command)


def init_db():
    from .models import User, Company
    db.create_all()


@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Initialized the database.')
