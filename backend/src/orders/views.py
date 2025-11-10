from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.request import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(tags=["orders"])
class OrderView(APIView):
    @extend_schema(
        summary="Obtener el detalle de una orden",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def get(self, request, pk):
        return Response(
            {"message": f"GET Item {pk} - Endpoint de lectura simulado"},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Editar el detalle de una orden",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def put(self, request, pk):
        return Response(
            {"message": f"PUT Item {pk} - Endpoint de actualización simulado"},
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=["orders"])
class OrdersView(APIView):
    @extend_schema(
        summary="Listar todas las ventas",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def get(self, request):
        return Response(
            {"message": "User Carlos"},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Cargar ordenes masivamene",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def post(self, request: HttpRequest):
        return Response({"message": "User created"})


@extend_schema(tags=["orders"])
class DownloadTemplateOrderView(APIView):
    @extend_schema(
        summary="Descargar template de carga de ordenes",
        responses={200: {"description": "Item creado con éxito"}},
    )
    def get(self, request):
        return Response(
            {"message": "Template"},
            status=status.HTTP_200_OK,
        )
