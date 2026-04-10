from accounts.views import login_view, dashboard_view
from django.urls import path
from django.http import HttpResponse

def home(request):
    return HttpResponse("Backend is running")



urlpatterns = [
    path('login/', login_view),
    path('dashboard/', dashboard_view),
    path('', home),
]