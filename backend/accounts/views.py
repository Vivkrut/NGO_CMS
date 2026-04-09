from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import User

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email, password=password)
            return JsonResponse({"message": "Login successful"})
        except User.DoesNotExist:
            return JsonResponse({"message": "Invalid credentials"}, status=400)

    return JsonResponse({"message": "Only POST allowed"})