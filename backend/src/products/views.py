from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from products.models import Category, Product
from products.serializers import CategorySerializer, ProductSerializer


@extend_schema(tags=["products"])
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all().order_by("description")
    serializer_class = ProductSerializer


@extend_schema(tags=["products"])
class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Category.objects.all().order_by("description")
    serializer_class = CategorySerializer
