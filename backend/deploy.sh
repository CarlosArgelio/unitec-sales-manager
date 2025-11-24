python3 -c src.manage.py migrate
gunicorn src.manager.wsgi
