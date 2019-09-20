from rest_framework import routers
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from .views import ContactDetailView, ContactListView

urlpatterns = [
    path('', ContactListView.as_view()),
    path('<int:pk>/', ContactDetailView.as_view()),
]
