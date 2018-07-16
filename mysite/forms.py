from django.forms import ModelForm
from .models import device_info

class PostForm(ModelForm):
	class Meta:
		model = device_info
		fields = ['id', 'device_name', 'device_ip', 'device_code']
