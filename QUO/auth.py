import functools
import secrets
from time import time
from json import dumps
from smtplib import SMTP
import os

from flask import Blueprint, g, session, request, redirect, url_for, flash, render_template, abort, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import ValidationError
from jwt import encode, decode, ExpiredSignatureError
from flask_cors import cross_origin

from .db import db
from .forms import UserForm, CompanyForm
from .models import User, Company, PositionCompany
from .schemas import CompanySchema, UserSchema, UsersSchema, PositionCompanySchema

bp = Blueprint("auth", __name__, url_prefix="/auth")
bp.config = {}


@bp.record
def record_params(setup_state):
    app = setup_state.app
    bp.config = dict([(key, value) for (key, value) in app.config.items() if key == "SECRET_KEY"])

    @app.before_request
    def load_user():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
            response.headers['Allow'] = 'POST, GET, OPTIONS'
            response.status = 200
            return response
        if not request.get_json():
            return "Not send json", 422
        token_data = {}
        try:
            token_data = decode_validation("session", request.get_json().get("session_token", None))
        except ExpiredSignatureError as e:
            redirect(url_for("auth.login"))

        if token_data:
            g.user = User.query.filter_by(user_id=token_data["user_id"]).first_or_404(description='User not find')
            del request.get_json()["session_token"]
        else:
            g.user = None


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


def decode_validation(active: str, token):
    if token is None:
        return None

    if token_data := decode(token.encode('utf-8'), bp.config["SECRET_KEY"], algorithms='HS256'):
        if token_data["active"] == active:
            return token_data
    return None


def create_session_token(user_id: int, expires_in=3600):
    return encode(
        {
            "active": "session",
            "user_id": user_id,
            "exp": time() + expires_in
        },
        bp.config["SECRET_KEY"],
        algorithm='HS256'
    )


def get_reset_psw_token(email: str, psw_hash: str, expires_in=432000):
    return encode({"active": "reset_psw", "email": email, "old_psw_hash": psw_hash, "exp": time() + expires_in},
                  bp.config["SECRET_KEY"], algorithm='HS256')


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


@bp.route("/api/NewCompany", methods=("POST",))
@cross_origin()
def test_route():
    if request.method == "POST":
        company_schema = CompanySchema(exclude=("company_id",))
        try:
            company_new = company_schema.load(request.get_json())
        except ValidationError as e:
            response = make_response()
            response.headers['Content-type'] = 'Json not valid'
            response.status = 422
            return response

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
            return {"session_token": create_session_token(user.user_id)}

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

    token_reset_psw = get_reset_psw_token(user_from_schema.email, user_from_schema.psw)

    send_post(user_from_schema.email, f'You can rest psw on this link linc/resetPsw/?token_psw={token_reset_psw}')

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


@bp.route("/api/profile", methods=("POST",))
@login_required
def profile():
    user_json = UserSchema(exclude=("psw", "company", "position")).dump(g.user)
    user_json["position"] = g.user.position.position

    return dumps(user_json), 200


@bp.route("/api/employees", methods=("POST", ))
@login_required
def employee():
    employees = User.query.filter_by(company_id=g.user.company_id).all()
    return UsersSchema(exclude=("psw", "company"), many=True).dumps(employees)


@bp.route("/api/setAdmin", methods=("POST", ))
@login_required
@admin_required
def set_admin():
    admin_company = g.user
    try:
        user_schema = UserSchema(only=("user_id", )).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    user = User.query.filter_by(user_id=user_schema.user_id).first_or_404(description='Not find user')

    if user.company_id != admin_company.company_id:
        abort(403)

    user.position_id = admin_company.position_id
    user.admin_status = True

    db.session.commit()

    return "User status change", 200


@bp.route("/resetPsw/<token_psw>", methods=("POST", ))
def reset_psw(token_psw):
    try:
        token_data = decode_validation("reset_psw", token_psw)
    except ExpiredSignatureError as e:
        return "Token time end", 400

    if token_data is None:
        return "Token not valid"

    user = User.query.filter_by(email=token_data["email"]).first_or_404(description="User not find")

    try:
        new_user = UserSchema(only=("psw", )).load(request.get_json())
    except ValidationError as e:
        return "Psw not valid", 422

    if user.psw != token_data["old_psw_hash"]:
        return "Token be using earlier", 400

    user.psw = generate_password_hash(new_user.psw)
    del new_user

    db.session.commit()
    return "Password changed", 200


@bp.route("/api/positions", methods=("POST", ))
@login_required
def positions():
    positions_company = PositionCompany.query.filter_by(company_id=g.user.company_id).all()
    return PositionCompanySchema(many=True).dumps(positions_company), 200


def send_post(email, mgs: str):
    server = SMTP("smtp.gmail.com", 587)

    server.starttls()

    server.login(os.environ.get("Email"), os.environ.get("Email_psw"))

    server.sendmail(os.environ.get("Email"), email, mgs)

    server.quit()


# @bp.route("/api/test", methods=("POST", "GET"))
# def test():
#     server = SMTP("smtp.gmail.com", 587)
#
#     server.starttls()
#
#     server.login("utor4ik@gmail.com", "Top*5*9*Rup7")
#
#     server.sendmail('utor4ik@gmail.com', 'roit94@mail.ru', 'test mesage')
#
#     server.quit()
#
#     return "Ok"
