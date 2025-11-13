from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import OrderHeaderViewSet, OrderRowViewSet

router = DefaultRouter()

router.register(r"header", OrderHeaderViewSet, basename="order_header")
router.register(r"row", OrderRowViewSet, basename="order_row")

urlpatterns = [
    path("orders/", include(router.urls)),
]
