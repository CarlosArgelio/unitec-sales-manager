from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.request import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(tags=["users"])
class UserView(APIView):
    @extend_schema(
        summary="Obtener el detalle de un solo usuario",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def get(self, request, pk):
        return Response(
            {"message": f"GET Item {pk} - Endpoint de lectura simulado"},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Editar el detalle de un solo usuario",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def put(self, request, pk):
        return Response(
            {"message": f"PUT Item {pk} - Endpoint de actualización simulado"},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Eliminar un solo usuario",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def delete(self, request, pk):
        return Response(
            {"message": f"DELETE Item {pk} - Endpoint de eliminación simulado"},
            status=status.HTTP_204_NO_CONTENT,
        )


@extend_schema(tags=["users"])
class UsersView(APIView):
    @extend_schema(
        summary="Listart todos los usuarios",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def get(self, request):
        return Response(
            {"message": "User Carlos"},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Crear un usuario",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def post(self, request: HttpRequest):
        return Response({"message": "User created"})
