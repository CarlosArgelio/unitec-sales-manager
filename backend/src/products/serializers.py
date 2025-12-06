from rest_framework import serializers
from django.db import IntegrityError, OperationalError
from django.core.exceptions import ValidationError
from django.db.models import Q

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["code", "description"]
    
    def validate_code(self, value):
        """
        Validar que el código no esté vacío y sea único.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("El código es requerido")
        
        # Convertir a mayúsculas para consistencia
        value = value.upper().strip()
        
        # En edición, verificar que no exista otro registro con el mismo código
        instance = getattr(self, 'instance', None)
        if instance:
            if Category.objects.filter(code=value).exclude(code=instance.code).exists():
                raise serializers.ValidationError("Ya existe una categoría con este código")
        else:
            # En creación, verificar que no exista
            if Category.objects.filter(code=value).exists():
                raise serializers.ValidationError("Ya existe una categoría con este código")
        
        return value
    
    def validate_description(self, value):
        """
        Validar que la descripción no esté vacía.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("La descripción es requerida")
        
        # Convertir a mayúsculas para consistencia
        value = value.upper().strip()
        
        return value
    
    def create(self, validated_data):
        """
        Crear producto con manejo de categoría y validación de código único.
        El frontend envía un objeto category_data {code, description}
        El código del producto se ingresa manualmente y se valida unicidad.
        """
        # Extraer y manejar category_data
        category_data = validated_data.pop('category_data', None)
        
        if category_data:
            # Validar que category_data sea un objeto
            if not isinstance(category_data, dict):
                raise serializers.ValidationError({
                    "category": "El campo categoría debe ser un objeto"
                })
            
            # Extraer código de categoría
            category_code = category_data.get('code')
            if not category_code:
                raise serializers.ValidationError({
                    "category": "El código de categoría es requerido"
                })
            
            # Buscar la categoría por código
            try:
                category_obj = Category.objects.get(code=category_code)
            except Category.DoesNotExist:
                raise serializers.ValidationError({
                    "category": f"No existe la categoría con código '{category_code}'"
                })
        else:
            raise serializers.ValidationError({
                "category": "El campo category_data es requerido"
            })
        
        # Crear el producto con código manual
        try:
            product = Product.objects.create(
                category=category_obj,
                **validated_data
            )
        except IntegrityError as e:
            error_msg = str(e)
            if "UNIQUE constraint" in error_msg or "duplicate key" in error_msg:
                if "code" in error_msg.lower():
                    raise serializers.ValidationError({
                        "code": "Ya existe un producto con este código"
                    })
                else:
                    raise serializers.ValidationError("Ya existe un producto con estos datos")
            else:
                raise serializers.ValidationError(f"Error de integridad en la base de datos: {str(e)}")
        except Exception as e:
            raise serializers.ValidationError(f"Error al crear el producto: {str(e)}")
        
        return product
    
    def update(self, instance, validated_data):
        """
        Actualizar categoría con manejo de errores de integridad.
        """
        try:
            code = validated_data.get('code', instance.code).strip().upper()
            description = validated_data.get('description', instance.description).strip().upper()
            
            # Validar unicidad de código si cambió
            if code != instance.code:
                if Category.objects.filter(code=code).exclude(code=instance.code).exists():
                    raise serializers.ValidationError({"code": "Ya existe otra categoría con este código"})
            
            # Validar unicidad de descripción si cambió  
            if description != instance.description:
                if Category.objects.filter(description=description).exclude(code=instance.code).exists():
                    raise serializers.ValidationError({"description": "Ya existe otra categoría con esta descripción"})
            
            # Actualizar la categoría
            instance.code = code
            instance.description = description
            instance.save()
            
            return instance
            
        except IntegrityError as e:
            error_msg = str(e)
            if "UNIQUE constraint" in error_msg or "duplicate key" in error_msg:
                if "code" in error_msg.lower():
                    raise serializers.ValidationError({"code": "Ya existe otra categoría con este código"})
                elif "description" in error_msg.lower():
                    raise serializers.ValidationError({"description": "Ya existe otra categoría con esta descripción"})
                else:
                    raise serializers.ValidationError("Ya existe otra categoría con estos datos")
            else:
                raise serializers.ValidationError(f"Error de integridad en la base de datos: {str(e)}")
        except OperationalError as e:
            raise serializers.ValidationError(f"Error de operación en la base de datos: {str(e)}")
        except Exception as e:
            raise serializers.ValidationError(f"Error al actualizar la categoría: {str(e)}")


class ProductSerializer(serializers.ModelSerializer):
    # Campo para permitir recibir y enviar objeto categoría
    category_data = serializers.JSONField(write_only=True)
    
    # Campo para mostrar la categoría de solo lectura
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ["code", "description", "price", "stock", "category", "category_data"]
        # read_only_fields = ["code"]  # El código es autogenerado

    def create(self, validated_data):
        """
        Crear producto con manejo de categoría.
        El frontend envía un objeto category_data {code, description}
        """
        category_data = validated_data.pop('category_data')
        
        # Validar que category_data sea un objeto
        if not isinstance(category_data, dict):
            raise serializers.ValidationError({
                "category": "El campo categoría debe ser un objeto"
            })
        
        # Extraer código de categoría
        category_code = category_data.get('code')
        if not category_code:
            raise serializers.ValidationError({
                "category": "El código de categoría es requerido"
            })
        
        # Buscar la categoría por código
        try:
            category_obj = Category.objects.get(code=category_code)
        except Category.DoesNotExist:
            raise serializers.ValidationError({
                "category": f"No existe la categoría con código '{category_code}'"
            })
        
        # Crear el producto
        product = Product.objects.create(
            category=category_obj,
            **validated_data
        )
        
        return product

    def update(self, instance, validated_data):
        """
        Actualizar producto con manejo de categoría.
        """
        category_data = validated_data.pop('category_data', None)
        
        if category_data:
            # Validar que category_data sea un objeto
            if not isinstance(category_data, dict):
                raise serializers.ValidationError({
                    "category": "El campo categoría debe ser un objeto"
                })
            
            # Extraer código de categoría
            category_code = category_data.get('code')
            if not category_code:
                raise serializers.ValidationError({
                    "category": "El código de categoría es requerido"
                })
            
            # Buscar la categoría por código
            try:
                category_obj = Category.objects.get(code=category_code)
            except Category.DoesNotExist:
                raise serializers.ValidationError({
                    "category": f"No existe la categoría con código '{category_code}'"
                })
            instance.category = category_obj
        
        # Actualizar el producto
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.stock = validated_data.get('stock', instance.stock)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        
        return instance
