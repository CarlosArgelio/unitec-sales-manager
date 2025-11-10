from django.urls import path

from .views import DownloadTemplateOrderView, OrdersView, OrderView

urlpatterns = [
    path("", OrdersView.as_view(), name="many orders"),
    path("<int:pk>/", OrderView.as_view(), name="one order"),
    path("templates/", DownloadTemplateOrderView.as_view(), name="template order"),
]
