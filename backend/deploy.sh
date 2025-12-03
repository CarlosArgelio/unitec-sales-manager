#!/usr/bin/env bash

# 1. Configurar las credenciales del Superusuario con variables de entorno
# Asegúrate de que estas variables de entorno (DJANGO_SUPERUSER_USERNAME, etc.)
# estén configuradas en tu entorno de OnRender.
#
# Nota: Reemplaza 'tu_username' y 'tu_password' si no quieres usar variables
# de entorno, pero se recomienda usarlas por seguridad.

SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME:-"admin"}
SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-"admin@example.com"}
SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-"secret"}

# 2. Crear el superusuario de forma no interactiva
# Esto utiliza un script de Python para llamar a createsuperuser
# sin que pida la entrada de datos.
echo "Creando Superusuario si no existe..."

ls -al

ls -al src/

pwd

python manager.py shell -c "import os; from django.contrib.auth import get_user_model; User = get_user_model(); \
    username = os.environ.get('SUPERUSER_USERNAME', 'admin'); \
    email = os.environ.get('SUPERUSER_EMAIL', 'admin@example.com'); \
    password = os.environ.get('SUPERUSER_PASSWORD', 'secret'); \
    if not User.objects.filter(username=username).exists(): \
        User.objects.create_superuser(username=username, email=email, password=password); \
        print(f'Superusuario {username} creado exitosamente.')"

# 3. Iniciar Gunicorn para correr la aplicación DRF
echo "Iniciando Gunicorn..."
gunicorn --chdir src manager.wsgi:application
