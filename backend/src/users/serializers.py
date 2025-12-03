from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_staff",
            "is_active",
        ]


class UserSignUpSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, label="Confirmar contraseña")
    
    class Meta:
        model = User
        fields = ["email", "username", "first_name", "last_name", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, attrs: dict) -> dict:
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password2": "Las contrasenas no coinciden"}
            )
        
        if len(attrs["password"]) < 6:
            raise serializers.ValidationError(
                {"password": "La contraseña debe tener al menos 6 caracteres"}
            )

        return attrs

    def create(self, validated_data: dict) -> dict:
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user
