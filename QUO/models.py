from .db import db


class User(db.Model):
    __tablename__ = "User"
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.VARCHAR(255), unique=True)
    psw = db.Column(db.VARCHAR(500), nullable=True)
    admin_status = db.Column(db.BOOLEAN, default=False, nullable=True)

    company = db.Column(db.Integer, db.ForeignKey('Company.company_id'))

    def __repr__(self):
        return f'<user {self.user_id}>'


class Company(db.Model):
    __tablename__ = "Company"
    company_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.VARCHAR(255), nullable=True, unique=True)

    def __repr__(self):
        return f'<company {self.company_id}>'
