import functools
import secrets
from time import time
from json import dumps

from flask import Blueprint, g, session, request, redirect, url_for, flash, render_template, abort
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import ValidationError
from jwt import encode

from .db import db
from .forms import UserForm, CompanyForm
from .models import User, Company, PositionCompany
from .schemas import CompanySchema, UserSchema

bp = Blueprint("auth", __name__, url_prefix="/auth")
bp.config = {}


@bp.record
def record_params(setup_state):
    app = setup_state.app
    bp.config = dict([(key, value) for (key, value) in app.config.items() if key == "SECRET_KEY"])


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))

        return view(**kwargs)

    return wrapped_view


def admin_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if not g.user.admin_status:
            return redirect(url_for("auth.login"))

        return view(**kwargs)

    return wrapped_view


@bp.before_request
def load_user():
    if user := User.query.filter_by(user_id=session.get("user_id")).first():
        g.user = user
    else:
        g.user = None


def get_reset_psw_token(email: str, expires_in=600):
    return encode({"active": "reset_psw", "email": email, "exp": time() + expires_in},
                  bp.config["SECRET_KEY"], algorithm='HS256').decode('utf-8')


@bp.route("/registerCompany", methods=("GET", "POST"))
def register_company():
    form_user = UserForm()
    form_company = CompanyForm()

    if request.method == "POST":
        form_user = UserForm(request.form)
        form_company = CompanyForm(request.form)

        if form_user.validate() and form_company.validate():
            user = User()
            company = Company()
            form_company.populate_obj(company)
            form_user.populate_obj(user)

            user.psw = generate_password_hash(request.form['psw'])
            user.position = 'Admin'
            company.employee.append(user)
            db.session.add(company)
            db.session.commit()

    return render_template('auth/regcomp.html', forms=[form_user, form_company])


@bp.route("/registerEmployee", methods=("GET", "POST"))
def register_employee():
    form_user = UserForm()

    if request.method == "POST":
        form_user = UserForm(request.form)

        if form_user.validate():
            user = User()

            form_user.populate_obj(user)

            user.psw = generate_password_hash(request.form['psw'])

            db.session.commit()

    return render_template('auth/regcomp.html', forms=[form_user])


@bp.route("/api/NewCompany", methods=("POST", ))
def test_route():
    if request.method == "POST":
        company_schema = CompanySchema(exclude=("company_id",))
        try:
            company_new = company_schema.load(request.get_json())
        except ValidationError as e:
            return "Json not valid", 422

        position = PositionCompany(position="Admin")
        company_new.positions.append(position)

        user = company_new.employee[0]
        user.psw = generate_password_hash(user.psw)
        user.position = position
        user.admin_status = True

        db.session.add(company_new)
        db.session.commit()
        return "Ok", 200

    return render_template('auth/index.html')


@bp.route("/api/login", methods=("POST",))
def login():
    if session.get("user_id"):
        return redirect(url_for("hello"))

    try:
        user_from_schema = UserSchema(only=("email", "psw")).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    user = User.query.filter_by(email=user_from_schema.email).first()
    if user:
        if check_password_hash(user.psw, user_from_schema.psw):
            session.clear()
            session["user_id"] = user.user_id
            return redirect(url_for("hello"))

    return "data entered incorrectly", 400


@bp.route("/api/logout", methods=("POST",))
def logout():
    session.clear()
    return redirect(url_for("hello"))


@bp.route("/api/NewEmployee", methods=("POST",))
@login_required
@admin_required
def new_employee():
    admin_company = g.user

    try:
        user_from_schema = UserSchema(only=("full_name", "email", "position", "admin_status")).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    pos_id_user = admin_company.position_id if user_from_schema.admin_status else user_from_schema.position.position_id

    pos = PositionCompany.query.filter_by(
        position_id=pos_id_user,
        company_id=admin_company.company.company_id
    ).first_or_404(description='Not find position')

    user_from_schema.company_id = admin_company.company.company_id
    user_from_schema.psw = generate_password_hash(secrets.token_hex())
    user_from_schema.position_id = pos.position_id
    del user_from_schema.position

    db.session.add(user_from_schema)
    db.session.commit()

    return "Create new employee", 200


@bp.route("/api/changeProfile", methods=("POST",))
@login_required
def changeProfile():
    try:
        user_change = UserSchema(only=("user_id", "full_name", "pdp")).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    if g.user.user_id != user_change.user_id:
        abort(403)

    user_db = User.query.filter_by(user_id=user_change.user_id).first()

    user_db.full_name = user_change.full_name
    user_db.pdp = user_change.pdp

    del user_change

    db.session.commit()

    return "Ok", 200


@bp.route("/api/profile", methods=("GET",))
@login_required
def profile():

    user_json = UserSchema(exclude=("psw", "company", "position")).dump(g.user)
    user_json["position"] = g.user.position.position

    return dumps(user_json), 200
