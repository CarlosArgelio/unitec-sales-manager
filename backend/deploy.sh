#!/usr/bin/env bash

SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME:-"admin"}
SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-"admin@example.com"}
SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-"secret"}

echo "Creando superusuario si no existe..."

python src/manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()

username = "$SUPERUSER_USERNAME"
email = "$SUPERUSER_EMAIL"
password = "$SUPERUSER_PASSWORD"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superusuario {username} creado exitosamente.")
else:
    print("Superusuario ya existe, no se creó uno nuevo.")
EOF

echo "Iniciando Gunicorn..."
gunicorn --chdir src manager.wsgi:application
