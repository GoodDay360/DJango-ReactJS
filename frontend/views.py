from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from core.settings import BASE_DIR
from pathlib import Path
from django_ratelimit.decorators import ratelimit
from django.views.decorators.csrf import ensure_csrf_cookie
import json


@ratelimit(key='ip', rate='60/m')
@ensure_csrf_cookie
def App(request):
    return render(request,'App.html')

