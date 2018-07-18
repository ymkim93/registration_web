from django.forms import ModelForm
from .models import device_info
from .models import set_info

class PostForm(ModelForm):
	class Meta:
		model = device_info
		fields = ['id', 'device_name', 'device_ip', 'device_code']

class SetinfoForm(ModelForm):
	class Meta:
		model = set_info
		fields = ['id', 'set_name', 'set_company', 'set_manager']