from django.db import models
from shared.models import TimeStampedModel


class Client(TimeStampedModel):
    ci: str = models.CharField(max_length=9, primary_key=True)
    name: str = models.CharField(max_length=100)
