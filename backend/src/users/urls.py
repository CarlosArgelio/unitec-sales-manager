from django.urls import path

from .views import UsersView, UserView

urlpatterns = [
    # 1. Endpoint to manager many users
    # URL: /api/users/
    path("", UsersView.as_view(), name="many users"),
    # 2. Endpoint to GET, PUT, DELETE (Detail user)
    # URL: /api/users/1/
    path("<int:pk>/", UserView.as_view(), name="one user"),
]
