from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("sign-in", obtain_auth_token, name="Login"),
]
