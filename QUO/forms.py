from wtforms_alchemy import ModelForm

from .models import User, Company


class UserForm(ModelForm):
    class Meta:
        model = User
        only = ['email', 'admin_status', 'psw']


class CompanyForm(ModelForm):
    class Meta:
        model = Company
        only = ['name']
