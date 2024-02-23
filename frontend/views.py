from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from core.settings import BASE_DIR
from pathlib import Path
from django_ratelimit.decorators import ratelimit
from django.views.decorators.csrf import ensure_csrf_cookie
import json

# Create your views here.
@ratelimit(key='ip', rate='60/m')
def favicon(request):
    return redirect("/static/media/ngs_logo.ico")

@ratelimit(key='ip', rate='60/m')
def manifest(request):
    with open(Path.joinpath(BASE_DIR, "frontend", "static", "script", "manifest.webmanifest")) as f:
        data = json.loads(f.read())
    return JsonResponse(data)


@ratelimit(key='ip', rate='60/m')
@ensure_csrf_cookie
def App(request):
    
    
    return render(request,'App.html')

@ratelimit(key='ip', rate='60/m')
def default_sw(request):
    dir = Path.joinpath(BASE_DIR, "frontend", "static", "script", "sw.js")
    with open(dir,"r") as f:
        data = f.read()
        f.close()
    
    
    return HttpResponse(data, content_type='application/javascript')

@ratelimit(key='ip', rate='60/m')
def firebase_messaging_sw(request):
    dir = Path.joinpath(BASE_DIR, "frontend", "static", "script", "firebase-messaging-sw.js")
    with open(dir,"r") as f:
        data = f.read()
        f.close()
    
    
    return HttpResponse(data, content_type='application/javascript')
