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

from .models import OrderHeader, OrderRow
from .serializers import OrderHeaderSerializer, OrderRowSerializer


@extend_schema(tags=["orders"])
class OrderHeaderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = OrderHeader.objects.all()
    serializer_class = OrderHeaderSerializer

    @action(
        detail=False,
        methods=["get"],
        url_path="dowload-template-orders-header",
    )
    def get_template_load_massive_orders_headers(
        self, request: HttpRequest
    ) -> Response:
        columns = list(OrderHeaderSerializer().get_fields().keys())

        wb = Workbook()
        ws = wb.active
        ws.title = "order-header"

        ws.append(columns)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response[
            "Content-Disposition"
        ] = 'attachment; filename="plantilla_encabeza_ordenes.xlsx"'

        wb.save(response)
        return response

    @action(detail=False, methods=["put"], url_path="upload-template-orders-header")
    def bulk_load_massive_orders_header(self, request: HttpRequest) -> Response:
        file = request.FILES.get("file")

        try:
            df = pd.read_excel(file)
            data_list = df.to_dict("records")

            serializer = OrderHeaderSerializer(data=data_list, many=True)
            if not serializer.is_valid():
                return Response(
                    serializer.error_messages, status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                order_header_object = [
                    OrderHeader(**item) for item in serializer.validated_data
                ]
                OrderHeader.objects.bulk_create(order_header_object)

            return Response({"succes": "load all data"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)


@extend_schema(tags=["orders"])
class OrderRowViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = OrderRow.objects.all()
    serializer_class = OrderRowSerializer

    @action(
        detail=False,
        methods=["get"],
        url_path="dowload-template-orders-row",
    )
    def get_template_load_massive_order_row(self, request: HttpRequest) -> Response:
        columns = list(OrderRowSerializer().get_fields().keys())

        wb = Workbook()
        ws = wb.active
        ws.title = "order-row"

        ws.append(columns)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response[
            "Content-Disposition"
        ] = 'attachment; filename="plantilla_renglones_ordenes.xlsx"'

        wb.save(response)
        return response

    @action(detail=False, methods=["put"], url_path="upload-template-orders-row")
    def bulk_load_massive_order_row(self, request: HttpRequest) -> Response:
        file = request.FILES.get("file")

        try:
            df = pd.read_excel(file)
            data_list = df.to_dict("records")

            serializer = OrderRowSerializer(data=data_list, many=True)
            if not serializer.is_valid():
                return Response(
                    serializer.error_messages, status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                order_row_object = [
                    OrderRow(**item) for item in serializer.validated_data
                ]
                OrderRow.objects.bulk_create(order_row_object)

            return Response({"succes": "load all data"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)
