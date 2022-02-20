
from marshmallow import ValidationError
from flask import Blueprint, g, request, abort
from sqlalchemy.sql import func

from .db import db
from .auth import login_required, admin_required
from .models import Task, User
from .schemas import TaskSchema

bp = Blueprint("task", __name__, url_prefix="/task")


@bp.route("/api/tasks", methods=("GET", ))
@login_required
def tasks():
    tasks_for_user = Task.query.filter_by(user_id=g.user.user_id).all()
    return TaskSchema(exclude=("user_id", ), many=True).dumps(tasks_for_user)


@bp.route("/api/createTask", methods=("POST", ))
@login_required
@admin_required
def create_task():
    admin_company = g.user
    try:
        new_task = TaskSchema(only=("name", "body", "user_id")).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    user = User.query.filter_by(user_id=new_task.user_id).first_or_404(description="User not find")

    if admin_company.company_id != user.company_id:
        abort(403)

    db.session.add(new_task)
    db.session.commit()
    return "Task create", 200


@bp.route("/api/changeStateTask", methods=("POST", ))
@login_required
def change_state_task():
    admin_company = g.user
    try:
        new_task = TaskSchema(only=("task_id", "state")).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    task = Task.query.filter_by(task_id=new_task.task_id).first_or_404(description="Task not find")

    if admin_company.company_id != task.employee.company_id:
        abort(403)

    if new_task.state == "PROCESS":
        task.date_start = func.now()

    if new_task.state == "FINISHED":
        task.date_end = func.now()

    task.state = new_task.state
    del new_task

    db.session.commit()
    return "Task state change", 200


@bp.route("/api/changeTask", methods=("POST", ))
@login_required
@admin_required
def change_task():
    admin_company = g.user

    try:
        new_task = TaskSchema(only=("task_id", "name", "body")).load(request.get_json())
    except ValidationError as e:
        return "Json not valid", 422

    task = Task.query.filter_by(task_id=new_task.task_id).first_or_404(description="Task not find")

    if admin_company.company_id != task.employee.company_id:
        abort(403)

    task.name = new_task.name
    task.body = new_task.body

    del new_task

    db.session.commit()

    return "Task change", 200
