from accounts.views import login_view, dashboard_view, register_view, staff_only_view, update_user_role, list_users, forgot_password_view, reset_password_view
from django.urls import path
from django.http import HttpResponse

def home(request):
    return HttpResponse("Backend is running")



urlpatterns = [
    path('login/', login_view),
    path('register/', register_view),
    path('forgot-password/', forgot_password_view),
    path('reset-password/', reset_password_view),
    path('dashboard/', dashboard_view),
    path('staff/overview/', staff_only_view),
    path('users/', list_users),
    path('users/<int:user_id>/role/', update_user_role),
    path('', home),
]