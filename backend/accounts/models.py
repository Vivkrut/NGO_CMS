from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password


class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, role='user'):
        if not email:
            raise ValueError("Email is required")

        user = self.model(
            email=self.normalize_email(email),
            full_name=full_name,
            role=role,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff / Content Manager'),
        ('user', 'User'),
    )

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )

    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email