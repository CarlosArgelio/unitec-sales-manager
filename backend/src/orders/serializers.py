from clients.serializers import ClientSerializer
from rest_framework import serializers

from .models import OrderHeader, OrderRow


class OrderRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderRow
        fields = ["quantity", "correlative", "product", "header"]


class OrderHeaderSerializer(serializers.ModelSerializer):
    client = ClientSerializer
    rows = OrderRowSerializer

    class Meta:
        model = OrderHeader
        fields = ["id", "currency", "exchange_rate", "_date", "client"]
