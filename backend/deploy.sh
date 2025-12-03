#!/usr/bin/env bash

# 1. Configurar las credenciales del Superusuario
SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME:-"admin"}
SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-"admin@example.com"}
SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-"secret"}

# CORRECCIÓN: Usar los nombres de variables de Bash correctos (SUPERUSER_...)
# y usar \ antes de las variables para la interpolación correcta.
PYTHON_COMMAND="import os; from django.contrib.auth import get_user_model; User = get_user_model(); username = '$SUPERUSER_USERNAME'; email = '$SUPERUSER_EMAIL'; password = '$SUPERUSER_PASSWORD'; if not User.objects.filter(username=username).exists(): User.objects.create_superuser(username=username, email=email, password=password); print(f'Superusuario $SUPERUSER_USERNAME creado exitosamente.')"


# 2. Crear el superusuario de forma no interactiva
echo "Creando Superusuario si no existe..."

# Si tu manage.py está en el mismo nivel que src (como antes) el comando debe ser:
# python manage.py shell -c "$PYTHON_COMMAND"
#
# Pero si el traceback indica la ruta: /opt/render/project/src/backend/src/manage.py
# Y tú estás ejecutando desde /opt/render/project/src/, puede que necesites usar la ruta relativa:
python src/manage.py shell -c "$PYTHON_COMMAND"

# 3. Iniciar Gunicorn para correr la aplicación DRF
echo "Iniciando Gunicorn..."
gunicorn --chdir src manager.wsgi:application
