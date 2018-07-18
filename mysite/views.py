from django.shortcuts import render, redirect
from .models import set_info
from .forms import SetinfoForm

# Create your views here.

def index(request):
	return render(request, 'mysite/index.html', {})

def reg_index(request):
	
	set_list = set_info.objects.all()

	return render(request, 'mysite/register/index.html', {'set_list' : set_list})

def reg_create(request):
	
	if request.method == "POST":
		form = SetinfoForm(request.POST)
		if form.is_valid():
			form.save()
		return redirect('/register')
	else:
		form = SetinfoForm()

	return render(request, 'mysite/register/create.html', {
		'form' : form
	})

def reg_detail(request):

	return render(request, 'mysite/register/set_detail.html', {

	})