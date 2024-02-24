
from django.contrib import admin
from django.urls import path, include, re_path
from frontend import views
# from backend import worker, api
# # from backend.api import account, admin, activate_account, check_connection, quizzes



urlpatterns = [
    path('', views.App),
    re_path(r'^.*/$', views.App),
]
