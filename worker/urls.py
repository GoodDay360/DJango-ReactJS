
from django.contrib import admin
from django.urls import path, include, re_path
from worker.jobs import (borrow_book, join_library, statistic)



urlpatterns = [
    path('borrow_book/delete_outdated/', borrow_book.delete_outdated),
    path('borrow_book/notify_return_book/', borrow_book.notify_return_book),
    
    path('join_library/delete_outdated/', join_library.delete_outdated),
    
    path('statistic/top_join_library/', statistic.top_join_library),
    path('statistic/monthly_join_library/', statistic.monthly_join_library),
]
