from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Client
from .serializers import ClientSerializer


@extend_schema(tags=["clients"])
class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Client.objects.all().order_by("ci")
    serializer_class = ClientSerializer
