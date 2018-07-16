from django.shortcuts import render
from .models import device_info
from .forms import PostForm

# Create your views here.

def index(request):
	return render(request, 'mysite/index.html', {})

def reg_index(request):
	device_list = device_info.objects.all()
	
	if request.method == "POST":
		form = PostForm(request.POST)
		if form.is_valid():
			form.save()
		return redirect('/main/register')
	else:
		form = PostForm()
		return render(request, 'mysite/register/index.html', {'form' : form, 'device_list' : device_list})

def reg_detail(request):
	return render(request, 'mysite/register/set_detail.html', {

	})