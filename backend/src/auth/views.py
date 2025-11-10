from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@extend_schema(tags=["auth"])
@api_view(["POST"])
def signin(request):
    return Response({"message": "Token"}, status=status.HTTP_201_CREATED)


@extend_schema(tags=["auth"])
@api_view(["POST"])
def revoke_token(request):
    return Response({"message": "Revoke Token"}, status=status.HTTP_201_CREATED)


@extend_schema(tags=["auth"])
@api_view(["POST"])
def refresh_token(request):
    return Response({"message": "Refresh Token"}, status=status.HTTP_200_OK)


@extend_schema(tags=["auth"])
@api_view(["POST"])
def logout(request):
    return Response({"message": "Logout user"}, status=status.HTTP_200_OK)


@extend_schema(tags=["auth"])
@api_view(["POST"])
def create_user(request):
    return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
