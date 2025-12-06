from clients.models import Client
from clients.serializers import ClientSerializer
from products.models import Product
from rest_framework import serializers

from .models import OrderHeader, OrderRow


class OrderRowSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField(read_only=True)
    header = serializers.StringRelatedField(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    header_id = serializers.PrimaryKeyRelatedField(
        queryset=OrderHeader.objects.all(),
        source='header',
        write_only=True
    )

    class Meta:
        model = OrderRow
        fields = ["id", "quantity", "correlative", "product", "header", "product_id", "header_id"]


class OrderHeaderSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        source='client',
        write_only=True
    )

    class Meta:
        model = OrderHeader
        fields = ["id", "currency", "exchange_rate", "_date", "client", "client_id"]
