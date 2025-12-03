from django.urls import path
from .views import CustomAuthToken

urlpatterns = [
    path("sign-in", CustomAuthToken.as_view(), name="Login"),
]