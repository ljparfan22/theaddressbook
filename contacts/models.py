from django.db import models
from django.contrib.auth.models import User


def nameFile(instance, filename):
    return '/'.join(['images', str(instance.name), filename])


class Contact(models.Model):
    name = models.CharField(max_length=100, unique=False)
    deletion_date = models.DateTimeField(blank=True, null=True, default=None)
    email = models.EmailField(max_length=100, unique=True)
    address = models.CharField(max_length=100, unique=False)
    phone_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(max_length=254,
                              blank=True, null=True)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE)
