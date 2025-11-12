from django.db import models


class TimeStampedModel(models.Model):
    """
    Clase abstracta que proporciona campos de fecha y hora de creación
    y de última modificación a cualquier modelo que la herede.
    """

    created_at = models.DateTimeField(
        auto_now_add=True,  # Establece la fecha y hora al crear el objeto. No se puede cambiar después.
        verbose_name="Fecha de Creación",
    )
    updated_at = models.DateTimeField(
        auto_now=True,  # Actualiza automáticamente la fecha y hora cada vez que se guarda el objeto.
        verbose_name="Última Modificación",
    )

    class Meta:
        # Esto es crucial: le dice a Django que NO cree una tabla para esta clase.
        # Sus campos solo serán heredados por sus modelos hijos.
        abstract = True
