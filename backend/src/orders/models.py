from datetime import date

from clients.models import Client
from django.db import models
from products.models import Product
from shared.models import TimeStampedModel


class OrderHeader(TimeStampedModel):
    class Currency(models.TextChoices):
        VES = "VES", "Bolivares Soberanos"
        USD = "USD", "Dolares Americanos"

    currency = models.CharField(
        max_length=100, choices=Currency.choices, default=Currency.VES
    )
    exchange_rate: float = models.DecimalField(max_digits=1000, decimal_places=2)
    _date: date = models.DateField()

    client = models.ForeignKey(
        Client, on_delete=models.RESTRICT, related_name="clients"
    )


class OrderRow(TimeStampedModel):
    quantity: int = models.IntegerField()
    correlative: int = models.IntegerField()

    # relations
    product = models.ForeignKey(
        Product, on_delete=models.RESTRICT, related_name="products"
    )
    header = models.ForeignKey(
        OrderHeader, on_delete=models.RESTRICT, related_name="header"
    )
