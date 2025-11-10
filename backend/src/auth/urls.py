from django.urls import path

from .views import create_user, logout, refresh_token, revoke_token, signin

urlpatterns = [
    path("add", create_user, name="create user"),
    path("sign-in", signin, name="Login"),
    path("revoke-token", revoke_token, name="revoke token"),
    path("refresh-token", refresh_token, name="refresh token"),
    path("logout", logout, name="logout token"),
]
