from enum import Enum

from sqlalchemy.sql import func

from .db import db


class TestType(Enum):
    ENGLISH = 'english'
    HARD_SKILL = 'hard_skill'
    SOFT_SKILL = 'soft_skill'


class PositionCompany(db.Model):
    __tablename__ = "PositionCompany"
    position_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    position = db.Column(db.VARCHAR(100), nullable=False)

    company_id = db.Column(db.Integer, db.ForeignKey('Company.company_id'), nullable=False)

    employee = db.relationship('User', backref=db.backref('position'), lazy=True)
    tests = db.relationship('Test', backref=db.backref('position'), lazy=True)

    def __eq__(self, other):
        return self.position_id == other.position_id


class User(db.Model):
    __tablename__ = "User"
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.VARCHAR(255), unique=True, nullable=False)
    psw = db.Column(db.VARCHAR(500), nullable=False)
    admin_status = db.Column(db.BOOLEAN, default=False, nullable=False)
    full_name = db.Column(db.VARCHAR(100), nullable=True)
    pdp = db.Column(db.VARCHAR(100), nullable=True, unique=True)

    position_id = db.Column(db.Integer, db.ForeignKey('PositionCompany.position_id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('Company.company_id'), nullable=False)

    task = db.relationship('Task', backref=db.backref('employee'), lazy=True)
    raise_appls = db.relationship('RaiseAppl', backref=db.backref('employee'), lazy=True)
    skill = db.relationship('Expert', backref=db.backref('expert'), lazy=True)
    tests_check = db.relationship('RaiseTests', backref=db.backref('expert'), lazy=True)

    def __repr__(self):
        return f'<user {self.user_id}>'


class Company(db.Model):
    __tablename__ = "Company"
    company_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.VARCHAR(255), nullable=False, unique=True)

    employee = db.relationship('User', backref=db.backref('company'), lazy=True)
    positions = db.relationship('PositionCompany', backref=db.backref('company'), lazy=True)

    def __repr__(self):
        return f'<company {self.company_id}>'


class TaskStateChoices(Enum):
    NOT_TAKEN = 'Not taken'
    PROCESS = 'Process'
    FINISHED = 'Finished'
    ARCHIVE = 'archive'


class Task(db.Model):
    __tablename__ = "Task"
    task_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.VARCHAR(100), nullable=False)
    body = db.Column(db.VARCHAR(255), nullable=True)
    state = db.Column(db.Enum(TaskStateChoices), default='NOT_TAKEN', nullable=False)
    date_create = db.Column(db.DateTime(timezone=True), server_default=func.now())
    date_start = db.Column(db.Date, nullable=True)
    date_end = db.Column(db.Date, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)

    def __repr__(self):
        return f'<Task {self.task_id}>'


class RaiseStateChoices(Enum):
    SUCCESSFUL = 'successful'
    ACTIVE = 'active'
    FAILED = 'failed'


class RaiseAppl(db.Model):
    __tablename__ = "RaiseAppl"
    appl_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date_create = db.Column(db.DateTime(timezone=True), server_default=func.now())
    date_finish = db.Column(db.Date, nullable=True)
    status = db.Column(db.Enum(RaiseStateChoices), default='ACTIVE', nullable=False)

    position_id = db.Column(db.Integer, db.ForeignKey('PositionCompany.position_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)

    raise_tests = db.relationship('RaiseTests', backref=db.backref('appl'), lazy=True)

    def __repr__(self):
        return f'<RaiseAppl {self.appl_id}>'


class TestStateChoices(Enum):
    ACTIVE = 'active'
    ARCHIVE = 'archive'


class Test(db.Model):
    __tablename__ = "Test"
    test_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.VARCHAR(100), nullable=False)
    time = db.Column(db.TIME(), nullable=False)
    status = db.Column(db.Enum(TestStateChoices), default='ACTIVE', nullable=False)
    type_test = db.Column(db.Enum(TestType), nullable=False)

    position_id = db.Column(db.Integer, db.ForeignKey('PositionCompany.position_id'), nullable=False)

    questions = db.relationship('Question', cascade="all, delete", backref=db.backref('test'), lazy=True)
    raise_tests = db.relationship('RaiseTests', backref=db.backref('test'), lazy=True)


class Question(db.Model):
    __tablename__ = "Question"
    question_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    body = db.Column(db.VARCHAR(255), nullable=False)
    answer = db.Column(db.VARCHAR(100), nullable=False)

    test_id = db.Column(db.Integer, db.ForeignKey('Test.test_id'), nullable=False)


class TestGreed(Enum):
    NOT_RATED = 'not_rated'
    ACTIVE = 'active'
    SUCCESSFUL = 'successful'
    NOT_START = 'not start'
    FAILED = 'failed'


class RaiseTests(db.Model):
    __tablename__ = "RaiseTests"
    test_id = db.Column(db.Integer, db.ForeignKey('Test.test_id'), nullable=False, primary_key=True)
    appl_id = db.Column(db.Integer, db.ForeignKey('RaiseAppl.appl_id'), nullable=False, primary_key=True)

    status = db.Column(db.Enum(TestGreed), default='NOT_START', nullable=False)

    expert_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)


class Expert(db.Model):
    __tablename__ = "Expert"
    exp_type = db.Column(db.Enum(TestType), primary_key=True)
    expert_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), primary_key=True)



