from .views import LoginView, RegisterView
from django.urls import path, include

urlpatterns = [
    path('login', LoginView.as_view(), name="login"),
    path('register', RegisterView.as_view(), name="register")
]
