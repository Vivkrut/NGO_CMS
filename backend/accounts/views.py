import logging
import os

from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

logger = logging.getLogger(__name__)


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class IsStaffOrAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in {"admin", "staff"}
        )


@api_view(['POST'])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })
        else:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def register_view(request):
    full_name = (request.data.get("full_name") or "").strip()
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password")
    role = "user"

    if not full_name or not email or not password:
        return Response({"message": "Full name, email, and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 8:
        return Response({"message": "Password must be at least 8 characters"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            email=email,
            full_name=full_name,
            password=password,
            role=role,
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Registration successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "email": user.email,
        }, status=status.HTTP_201_CREATED)
    except Exception as exc:
        return Response({"message": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def forgot_password_view(request):
    email = (request.data.get("email") or "").strip().lower()
    if not email:
        return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    frontend_base = os.environ.get("FRONTEND_BASE_URL", "http://localhost:3000").rstrip("/")

    # Always return a generic message to avoid email enumeration.
    response_payload = {"message": "If the account exists, a reset link will be sent."}

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(response_payload)

    token = PasswordResetTokenGenerator().make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.id))
    reset_link = f"{frontend_base}/reset-password/{uid}/{token}"

    try:
        send_mail(
            subject="Reset your password",
            message=(
                "We received a password reset request for your account. "
                f"Use this link to set a new password: {reset_link}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send password reset email")
        return Response({"message": "Email service error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(response_payload)


@api_view(['POST'])
def reset_password_view(request):
    uid = request.data.get("uid")
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    if not uid or not token or not new_password:
        return Response({"message": "uid, token, and new_password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 8:
        return Response({"message": "Password must be at least 8 characters"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(id=user_id)
    except (User.DoesNotExist, ValueError, TypeError):
        return Response({"message": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST)

    if not PasswordResetTokenGenerator().check_token(user, token):
        return Response({"message": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save(update_fields=["password"])

    return Response({"message": "Password reset successful"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    return Response({
        "message": "Welcome to dashboard",
        "user": request.user.email,
        "role": request.user.role,
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdminRole])
def update_user_role(request, user_id):
    new_role = (request.data.get("role") or "").strip().lower()
    valid_roles = {choice[0] for choice in User.ROLE_CHOICES}

    if new_role not in valid_roles:
        return Response({"message": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user.role = new_role
    user.save(update_fields=["role"])

    return Response({
        "message": "Role updated",
        "user_id": user.id,
        "role": user.role,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminRole])
def list_users(request):
    users = User.objects.all().order_by("id")
    payload = [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "status": user.status,
        }
        for user in users
    ]
    return Response({"users": payload})


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStaffOrAdminRole])
def staff_only_view(request):
    return Response({
        "message": "Staff access granted",
        "user": request.user.email,
        "role": request.user.role,
    })