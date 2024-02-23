
from django.contrib import admin
from django.urls import path, include, re_path
from frontend import views
# from backend import worker, api
# # from backend.api import account, admin, activate_account, check_connection, quizzes



urlpatterns = [
    path('favicon.ico/', views.favicon),
    path('favicon.ico', views.favicon),
    path('manifest.webmanifest/', views.manifest),
    path('manifest.webmanifest', views.manifest),

    path('', views.App),
    re_path(r'^.*/$', views.App),

    path('sw.js/', views.default_sw),
    path('sw.js', views.default_sw),
    path('firebase-messaging-sw.js/', views.firebase_messaging_sw),
    path('firebase-messaging-sw.js', views.firebase_messaging_sw),
]
