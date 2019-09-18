# Add these lines at the top of your views.py file
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework_jwt.settings import api_settings
from rest_framework import permissions
from .serializers import TokenSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.views import status
from rest_framework import generics

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class LoginView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = TokenSerializer(data={
                "token": jwt_encode_handler(
                    jwt_payload_handler(user)
                )})
            serializer.is_valid()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        email = request.data.get("email", "")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        if not username or not password or not email or not first_name or not last_name:
            return Response(
                data={
                    "message": "Insufficient data. Required fields are username, password, email, first_name, last_name."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            existing_user = User.objects.get(username=username)
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User already exists."})
        except User.DoesNotExist:
            new_user = User.objects.create_user(
                username=username, password=password, email=email, first_name=first_name, last_name=last_name)
            serializer = UserSerializer(data={
                "username": new_user.username,
                "id": new_user.id,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "email": new_user.email,
                "date_joined": new_user.date_joined
            })
            serializer.is_valid()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
