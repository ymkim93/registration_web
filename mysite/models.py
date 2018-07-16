from django.db import models

class set_info(models.Model):
	set_name = models.CharField(max_length=30)

class device_info(models.Model):
	device_name = models.CharField(max_length=30)
	device_ip = models.CharField(max_length=30)
	device_code = models.CharField(max_length=30)
	create_date = models.DateTimeField(null=True)