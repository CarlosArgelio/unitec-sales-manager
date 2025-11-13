from clients.serializers import ClientSerializer
from rest_framework import serializers

from .models import OrderHeader, OrderRow


class OrderRowSerializer(serializers.Serializer):
    class Meta:
        model = OrderRow
        fields = ["quantity", "correlative", "product", "header"]


class OrderHeaderSerializer(serializers.Serializer):
    client = ClientSerializer
    rows = OrderRowSerializer

    class Meta:
        model = OrderHeader
        fields = ["currency", "exchange_rate", "_date", "client"]
