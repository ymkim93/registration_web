from django.forms import ModelForm
from .models import Setinfo
from .models import Deviceinfo

class SetinfoForm(ModelForm):
	class Meta:
		model = Setinfo
		fields = ['id', 'set_name', 'set_company', 'set_manager']

class PostForm(ModelForm):
	class Meta:
		model = Deviceinfo
		fields = ['id', 'device_name', 'device_ip', 'device_code']