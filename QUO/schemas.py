from marshmallow import Schema, fields, post_load, validate
from jwt import encode, decode

from .models import PositionCompany, User, Company, Task


class PositionCompanySchema(Schema):
    position_id = fields.Integer(required=True)
    position = fields.String(required=True)

    @post_load
    def post_func(self, data, **kwargs):
        return PositionCompany(**data)


class CompanySchema(Schema):
    company_id = fields.Integer(required=True)
    name = fields.String(required=True)
    employee = fields.List(fields.Nested(lambda: UserSchema(only=("email", "psw", "full_name")), required=True))
    positions = fields.List(fields.Nested(PositionCompanySchema(exclude=("position_id",))), required=True)

    @post_load
    def post_func(self, data, **kwargs):
        return Company(**data)


class UserSchema(Schema):
    user_id = fields.Integer(required=True)
    email = fields.Email(required=True)
    psw = fields.String(required=True)
    admin_status = fields.Boolean()
    full_name = fields.String(required=True)
    pdp = fields.String(required=True)
    company = fields.Nested(CompanySchema(exclude=("employee", "positions")), required=True)
    position = fields.Nested(PositionCompanySchema(only=("position_id",)), required=True)

    @post_load
    def post_func(self, data, **kwargs):
        return User(**data)


class UsersSchema(UserSchema):
    position = fields.Nested(PositionCompanySchema(only=("position",)), required=True)


class TaskSchema(Schema):
    task_id = fields.Integer(required=True)
    name = fields.String(required=True)
    body = fields.String()
    state = fields.String(validate=validate.OneOf(['NOT_TAKEN', 'PROCESS', 'FINISHED', 'ARCHIVE']))
    date_create = fields.DateTime()
    date_start = fields.Date()
    date_end = fields.Date()
    user_id = fields.Integer(required=True)

    @post_load
    def post_func(self, data, **kwargs):
        return Task(**data)

