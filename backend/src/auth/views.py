from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework import status
from users.serializers import UserSerializer
import logging

# Configurar logger
logger = logging.getLogger(__name__)


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        # Obtener credenciales
        username = request.data.get('username')
        password = request.data.get('password')
        
        logger.info(f"Login attempt for user: {username}")
        
        if not username or not password:
            logger.error("Username or password missing")
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Autenticar usuario
        user = authenticate(username=username, password=password)
        
        if not user:
            logger.error(f"Invalid credentials for user: {username}")
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear o obtener token
        token, created = Token.objects.get_or_create(user=user)
        
        # Serializar datos del usuario
        user_data = UserSerializer(user).data
        
        response_data = {
            'token': token.key,
            'user': user_data
        }
        
        logger.info(f"Login successful for user: {username}")
        logger.info(f"Response data: {response_data}")
        
        return Response(response_data)