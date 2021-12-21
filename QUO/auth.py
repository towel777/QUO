import functools

from flask import Blueprint, g, session, request, redirect, url_for, flash, render_template

from werkzeug.security import generate_password_hash, check_password_hash

from .db import db
from .forms import UserForm, CompanyForm
from .models import User, Company

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/registerCompany", methods=("GET", "POST"))
def register():
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
            company.employee.append(user)
            db.session.add(company)
            db.session.commit()

    return render_template('auth/regcomp.html', forms=[form_user, form_company])
