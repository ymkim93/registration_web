from django.shortcuts import get_object_or_404, render, redirect
from .models import Setinfo, Deviceinfo
from .forms import SetinfoForm

# Create your views here.

def index(request):

	return render(request, 'mysite/index.html', {

	})

def reg_index(request):
	
	set_list = Setinfo.objects.all()

	return render(request, 'mysite/register/index.html', {
		'set_list': set_list,
	})

def reg_create(request):
	
	if request.method == "POST":
		form = SetinfoForm(request.POST)
		if form.is_valid():
			form.save()
		return redirect('/register')
	else:
		form = SetinfoForm()

	return render(request, 'mysite/register/create.html', {
		'form': form,
	})

def reg_detail(request, pk):

	set = get_object_or_404(Setinfo, pk=pk)
	
	device_list = Deviceinfo.objects.all()
	device_list = device_list.filter(set_number=pk)

	return render(request, 'mysite/register/set_detail.html', {
		'set': set,
		'device_list': device_list,
	})