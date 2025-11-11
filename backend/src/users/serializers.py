from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "is_staff",
            "is_active",
        ]


class UserSignUpSerilializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "password", "password2"]

    def validate(self, attrs: dict) -> dict:
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password2": "Las contrasenas no coinciden"}
            )

        return attrs

    def create(self, validated_data: dict) -> dict:
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user
