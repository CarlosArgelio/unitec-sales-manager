import pandas as pd
from django.db import transaction
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema
from openpyxl import Workbook
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import HttpRequest
from rest_framework.response import Response

from products.models import Category, Product
from products.serializers import CategorySerializer, ProductSerializer


@extend_schema(tags=["products"])
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all().order_by("description")
    serializer_class = ProductSerializer

    @action(
        detail=False,
        methods=["get"],
        url_path="dowload-template-products",
    )
    def get_template_load_massive_products(self, request: HttpRequest) -> Response:
        columns = list(ProductSerializer().get_fields().keys())

        wb = Workbook()
        ws = wb.active
        ws.title = "products"

        ws.append(columns)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response[
            "Content-Disposition"
        ] = 'attachment; filename="plantilla_productos.xlsx"'

        wb.save(response)
        return response

    @action(detail=False, methods=["put"], url_path="upload-template-products")
    def bulk_load_massive_products(self, request: HttpRequest) -> Response:
        file = request.FILES.get("file")

        try:
            df = pd.read_excel(file)
            data_list = df.to_dict("records")

            serializer = ProductSerializer(data=data_list, many=True)
            if not serializer.is_valid():
                return Response(
                    serializer.error_messages, status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                product_object = [Product(**item) for item in serializer.validated_data]
                Product.objects.bulk_create(product_object)

            return Response({"succes": "load all data"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)


@extend_schema(tags=["products"])
class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Category.objects.all().order_by("description")
    serializer_class = CategorySerializer

    @action(
        detail=False,
        methods=["get"],
        url_path="dowload-template-categories",
    )
    def get_template_load_massive_category(self, request: HttpRequest) -> Response:
        columns = list(CategorySerializer().get_fields().keys())

        wb = Workbook()
        ws = wb.active
        ws.title = "categories"

        ws.append(columns)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response[
            "Content-Disposition"
        ] = 'attachment; filename="plantilla_categorias.xlsx"'

        wb.save(response)
        return response

    @action(detail=False, methods=["put"], url_path="upload-template-products")
    def bulk_load_massive_products(self, request: HttpRequest) -> Response:
        file = request.FILES.get("file")

        try:
            df = pd.read_excel(file)
            data_list = df.to_dict("records")

            serializer = CategorySerializer(data=data_list, many=True)
            if not serializer.is_valid():
                return Response(
                    serializer.error_messages, status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                category_object = [
                    Category(**item) for item in serializer.validated_data
                ]
                Category.objects.bulk_create(category_object)

            return Response({"succes": "load all data"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)
