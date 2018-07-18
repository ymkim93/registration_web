from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^register/$', views.reg_index, name='reg_index'),
	url(r'^register/create/$', views.reg_create, name='reg_create'),
	url(r'^register/test/$', views.reg_detail, name='reg_detail'),
]