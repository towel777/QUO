from marshmallow import Schema, fields, post_load

from .models import PositionCompany, User, Company


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
    position = fields.Nested(PositionCompanySchema(only=("position_id", )), required=True)

    @post_load
    def post_func(self, data, **kwargs):
        return User(**data)
