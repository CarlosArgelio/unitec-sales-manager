from django.db import models
from shared.models import TimeStampedModel


class Category(TimeStampedModel):
    code: str = models.CharField(primary_key=True, editable=False)
    description: str = models.TextField(blank=False, null=False)

    def __str__(self) -> str:
        return self.description


class Product(TimeStampedModel):
    code: str = models.CharField(primary_key=True, editable=False)
    description: str = models.TextField(blank=False, null=False)
    price: float = models.DecimalField(max_digits=100, decimal_places=2)
    stock: int = models.IntegerField(default=0)
    is_active: bool = models.BooleanField(default=True)

    # relations
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )

    def __str__(self) -> str:
        return self.description
