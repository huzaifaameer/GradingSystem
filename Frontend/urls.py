from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # path('result/', views.result, name='index'),
    path('result/', views.result, name='index'),
    path('getPDF/', views.getPDF, name='index'),
]