import datetime

from flask import Blueprint, g, request, abort
from marshmallow import ValidationError
from sqlalchemy import func, text

from .auth import login_required, admin_required
from .schemas import TestSchema, ExpertSchema, PositionCompanySchema
from .db import db
from .models import PositionCompany, TestStateChoices, Test, RaiseTests, TestGreed, User, RaiseAppl, Expert, RaiseStateChoices

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
