import datetime
from json import dumps

from flask import Blueprint, g, request, abort
from marshmallow import ValidationError
from sqlalchemy import func, text

from .auth import login_required, admin_required, create_test_token, decode_validation, expert_token, send_post
from .schemas import TestSchema, ExpertSchema, PositionCompanySchema, RaiseTestsSchema, QuestionSchema,\
    AnswerTestSchema, AnswerUserSchema
from .db import db
from .models import PositionCompany, TestStateChoices, Test, RaiseTests, TestGreed, User, RaiseAppl, Expert, \
    RaiseStateChoices, Question, AnswerUser

bp = Blueprint("exam", __name__, url_prefix="/exam")


def create_obj_test():
    admin_company = g.user
    try:
        new_test = TestSchema(exclude=("test_id",)).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    position = PositionCompany.query.filter_by(
        position_id=new_test.position_id
    ).first_or_404(description="Position not find")

    if position.company_id != admin_company.company_id:
        abort(403)

    return new_test


@bp.route("/api/createTest", methods=("POST",))
@login_required
@admin_required
def create_test():
    new_test = create_obj_test()

    db.session.add(new_test)
    db.session.commit()

    return "Test create", 200


@bp.route("/api/changeTest", methods=("POST",))
@login_required
@admin_required
def change_test():
    test = Test.query.filter_by(test_id=request.get_json().get("test_id")).first_or_404(description="Not find")
    del request.get_json()["test_id"]

    new_test = create_obj_test()

    if not RaiseTests.query.filter_by(test_id=test.test_id, status='ACTIVE').first():
        db.session.delete(test)
    else:
        test.status = TestStateChoices.ARCHIVE
    print(type(new_test))

    db.session.add(new_test)
    db.session.commit()

    return "Test changed", 200


@bp.route("/api/setExpert", methods=("POST",))
@login_required
@admin_required
def set_expert():
    admin_company = g.user

    try:
        new_expert = ExpertSchema().load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    user = User.query.filter_by(user_id=new_expert.expert_id).first_or_404(description="Not find user")

    if user.company_id != admin_company.company_id:
        abort(403)

    db.session.add(new_expert)
    db.session.commit()

    return "Expert create", 200


@bp.route("/api/startRaise", methods=("POST",))
@login_required
def start_raise():
    if g.user.admin_status:
        return "Admin can't raising", 400

    try:
        position_raise = PositionCompanySchema(only=("position_id",)).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    position_id = position_raise.position_id
    del position_raise

    raise_appl = RaiseAppl.query.filter_by(user_id=g.user.user_id).order_by(RaiseAppl.date_create.desc()).first()

    if raise_appl:
        error = raise_start_valid(raise_appl)
        if error is not None:
            return error, 400

    new_raise_appl = RaiseAppl(status='ACTIVE', position_id=position_id, user_id=g.user.user_id)

    tests_for_position = Test.query.filter_by(status='ACTIVE', position_id=position_id).all()

    try:
        new_raise_appl.raise_tests.append(*map(
            lambda test_item: create_raise_test(test_item.test_id, test_item.type_test),
            tests_for_position
        ))
    except ValueError:
        return "Can't start raising: expert for test not find", 400

    db.session.add(new_raise_appl)
    db.session.commit()

    return "Ok", 200


def raise_start_valid(raise_appl: RaiseAppl):
    if raise_appl.status == RaiseStateChoices.ACTIVE:
        return "Can't start raising: raising start earlier"

    error = None

    if raise_appl.status == RaiseStateChoices.FAILED:
        if (raise_appl.date_finish + datetime.timedelta(90)) > datetime.datetime.now().date():
            error = f"Can't start raising: test will be available {raise_appl.date_finish + datetime.timedelta(90)}"

    if raise_appl.status == RaiseStateChoices.SUCCESSFUL:
        if (raise_appl.date_finish + datetime.timedelta(365)) > datetime.datetime.now().date():
            error = f"Can't start raising: test will be available {raise_appl.date_finish + datetime.timedelta(365)}"

    return error


def create_raise_test(test_id: int, type_test):
    expert_company = Expert.query.join(
        User,
        ((User.user_id == Expert.expert_id) & (Expert.exp_type == type_test))
    ).filter_by(company_id=g.user.company_id).subquery().alias("expert_company")

    raise_test_expert = db.session.query(expert_company.c.expert_id, func.count(RaiseTests.appl_id)).select_from(
        expert_company
    ).outerjoin(
        RaiseTests,
        RaiseTests.expert_id == expert_company.c.expert_id
    ).group_by(expert_company.c.expert_id).order_by(text("count_1")).first()

    if raise_test_expert is None:
        raise ValueError

    raise_test = RaiseTests(expert_id=raise_test_expert[0], status='NOT_START', test_id=test_id)

    return raise_test


@bp.route('/api/activeRaise', methods=('POST',))
@login_required
def active_raise():
    active_appl = RaiseAppl.query.filter_by(user_id=g.user.user_id, status='ACTIVE').first()

    if not active_appl:
        return "Not find active raise", 400

    return RaiseTestsSchema(many=True).dumps(RaiseTests.query.filter_by(appl_id=active_appl.appl_id).all()), 200


@bp.route('/api/startTest', methods=('POST',))
@login_required
def start_test():
    try:
        test_raise = RaiseTestsSchema(only=('test_id', 'appl_id')).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    if not RaiseAppl.query.filter_by(appl_id=test_raise['appl_id'], user_id=g.user.user_id, status='ACTIVE'):
        return "Not find test for user", 400

    raise_test = RaiseTests.query.filter_by(
        test_id=test_raise['test_id'],
        appl_id=test_raise['appl_id'],
        status='NOT_START'
    ).first()

    if not raise_test:
        return "Test was complete earlier", 400

    raise_test.status = TestGreed.ACTIVE

    questions = QuestionSchema(many=True, only=('question_id', 'body')).dump(
        Question.query.filter_by(
            test_id=test_raise['test_id']
        ).all()
    )

    token_test = create_test_token({
        "test_id": test_raise['test_id'],
        'appl_id': test_raise['appl_id']
    })

    ret_data = {
        'token_test': token_test,
        'questions': questions
    }

    db.session.commit()
    return dumps(ret_data), 200


@bp.route('/api/endTest/<token_test>', methods=("POST",))
def end_test(token_test):
    token_data = decode_validation('test_token', token_test)

    raise_test = RaiseTests.query.filter_by(test_id=token_data['test_id'], appl_id=token_data['appl_id']).first()

    if raise_test.status != TestGreed.ACTIVE:
        return "Test was complete earlier", 400

    test_time = raise_test.test.time

    if datetime.datetime.strptime(
            token_data['create_time'], '%Y-%m-%d %H:%M:%S.%f'
    ) + datetime.timedelta(
        hours=test_time.hour,
        minutes=test_time.minute,
        seconds=test_time.second
    ) < datetime.datetime.now():
        raise_test.status = TestGreed.FAILED
        db.session.commit()
        return "time test end", 400

    try:
        answers_user = AnswerTestSchema().load(request.get_json()).get("answers")
    except ValidationError as e:
        return "Json not valid", 422

    questions = dict(map(
        lambda x: (x.question_id, x.answer),
        Question.query.filter_by(test_id=token_data['test_id']).all()))

    def check_answer(answer):
        corectly_answer = questions.get(answer.question_id)

        if not corectly_answer:
            return "Not find question in this test", 400

        answer.correctly = answer.answer.lower() == corectly_answer.lower()
        answer.test_id = token_data['test_id']
        answer.appl_id = token_data['appl_id']

        return answer

    for item in map(check_answer, answers_user):
        db.session.add(item)

    raise_test.status = TestGreed.NOT_RATED

    db.session.commit()

    send_post(
        User.query.filter_by(user_id=raise_test.expert_id).first().email,
        f'Check test for this linc {expert_token({"test_id": raise_test.test_id,"appl_id": raise_test.appl_id})}'
    )

    return "Ok", 200


@bp.route('/api/expertCheck/<token_expert>', methods=("POST", ))
def expert_check(token_expert):
    token_data = decode_validation('expert_token', token_expert)

    raise_test = RaiseTests.query.filter_by(test_id=token_data['test_id'], appl_id=token_data['appl_id']).first()

    if raise_test.status != TestGreed.NOT_RATED:
        return "You can't evaluation this test", 400

    answers_user = AnswerUser.query.filter_by(test_id=token_data['test_id'], appl_id=token_data['appl_id']).all()

    return AnswerUserSchema(many=True, only=('answer', 'correctly', 'question')).dumps(answers_user), 200


@bp.route('/api/expertGrade/<token_expert>', methods=("POST", ))
def expert_Grade(token_expert):
    token_data = decode_validation('expert_token', token_expert)

    raise_test = RaiseTests.query.filter_by(test_id=token_data['test_id'], appl_id=token_data['appl_id']).first()

    if raise_test.status != TestGreed.NOT_RATED:
        return "You can't evaluation this test", 400

    if grade := request.get_json().get("grade"):
        raise_test.status = TestGreed.SUCCESSFUL if grade else TestGreed.FAILED
        appl_raise = RaiseAppl.query.filter_by(appl_id=token_data['appl_id']).first()
        appl_raise.status = check_all_grade(token_data['appl_id'])
        db.session.commit()
        return "Ok", 200

    return "Grade not set", 400


def check_all_grade(appl_id):
    grade_appl = set(map(lambda x: x.status, RaiseTests.query.filter_by(appl_id=appl_id).all()))

    if len(grade_appl) > 1:
        return RaiseStateChoices.ACTIVE

    if grade_appl.pop() == TestGreed.FAILED:
        return RaiseStateChoices.FAILED

    if grade_appl.pop() == TestGreed.SUCCESSFUL:
        return RaiseStateChoices.SUCCESSFUL

    return RaiseStateChoices.ACTIVE


@bp.route('/api/tests', methods=("POST", ))
@login_required
@admin_required
def tests():
    positions = PositionCompany.query.filter_by(company_id=g.user.company_id).subquery()
    company_tests = Test.query.join(positions, positions.c.position_id == Test.position_id).all()

    return TestSchema(many=True, exclude=('questions', )).dumps(company_tests)


@bp.route('/api/questions/<int:test_id>', methods=("POST", ))
@login_required
@admin_required
def questions(test_id):
    return QuestionSchema(many=True, only=('question_id', 'body', 'answer')).dumps(
        Question.query.filter_by(
            test_id=test_id
        ).all()
    )
