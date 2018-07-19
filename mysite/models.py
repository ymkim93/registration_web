from django.db import models

class Setinfo(models.Model):
	set_name 	= models.CharField(max_length=30)
	set_company = models.CharField(max_length=30)
	set_manager = models.CharField(max_length=30)

class Deviceinfo(models.Model):
	device_name = models.CharField(max_length=30)
	device_ip = models.CharField(max_length=30)
	device_code = models.CharField(max_length=30)
	set_number = models.CharField(max_length=30)
	create_date = models.DateTimeField(null=True)