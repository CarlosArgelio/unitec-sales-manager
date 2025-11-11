from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import HttpRequest
from rest_framework.response import Response

from users.serializers import (
    UserSerializer,
    UserSignUpSerilializer,
)

User = get_user_model()


@extend_schema(
    tags=["users"],
    description="Seccion para la gestion de usuarios",
)
class UserListViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @extend_schema(summary="Listar usuarios")
    def list(self, request: HttpRequest) -> Response:
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            # 4.3. Serialización con 'many=True'
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


@extend_schema(
    tags=["users"],
    description="Seccion para la gestion de usuarios",
)
class UserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Obtener el detalle")
    def retrieve(self, request: HttpRequest, pk: int | None = None) -> Response:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @extend_schema(
        summary="Editar usuario",
        request=UserSerializer,
        responses={
            200: {"description": "Usuario editado"},
            404: {"description": "Usuario no encontrado"},
        },
    )
    def update(self, request: HttpRequest, pk: int | None = None) -> Response:
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                serializer.error_messages, status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return Response(serializer.data)

    @extend_schema(summary="Crear usuario", request=UserSerializer)
    def create(self, request: HttpRequest) -> Response:
        serializer = UserSignUpSerilializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.error_messages, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.data)
