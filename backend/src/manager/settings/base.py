from pathlib import Path

import environ
from configurations import Configuration
from configurations.values import SecretValue

env = environ.Env()

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

environ.Env.read_env(str(BASE_DIR / ".env"))


class Base(Configuration):
    SECRET_KEY = SecretValue()

    # Application definition
    INSTALLED_APPS = [
        "corsheaders",
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        "drf_spectacular",
        "rest_framework",
        "rest_framework.authtoken",
        "src.products",
        "src.clients",
        "src.orders",
    ]

    REST_FRAMEWORK = {
        "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
        # Paginate configuration
        "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
        "PAGE_SIZE": 10,
        "PAGE_SIZE_QUERY_PARAM": "page_size",
        "MAX_PAGE_SIZE": 100,
    }

    MIDDLEWARE = [
        "corsheaders.middleware.CorsMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
    ]

    ROOT_URLCONF = "manager.urls"

    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [],
            "APP_DIRS": True,
            "OPTIONS": {
                "context_processors": [
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                ],
            },
        },
    ]

    WSGI_APPLICATION = "manager.wsgi.application"

    # Database
    # https://docs.djangoproject.com/en/5.2/ref/settings/#databases

    DATABASES = {
        "default": {
            "ENGINE": env.get_value("DATABASE_ENGINE"),
            "NAME": env.get_value("DATABASE_NAME"),
            "USER": env.get_value("DATABASE_USER"),
            "PASSWORD": env.get_value("DATABASE_PASSWORD"),
            "HOST": env.get_value("DATABASE_HOST"),
            "PORT": env.get_value("DATABASE_PORT"),
        }
    }

    # Password validation
    # https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

    AUTH_PASSWORD_VALIDATORS = [
        {
            "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
        },
    ]

    # Internationalization
    # https://docs.djangoproject.com/en/5.2/topics/i18n/

    LANGUAGE_CODE = "en-us"

    TIME_ZONE = "UTC"

    USE_I18N = True

    USE_TZ = True

    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/5.2/howto/static-files/

    STATIC_URL = "static/"

    # Default primary key field type
    # https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

    DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

    SPECTACULAR_SETTINGS = {
        "TITLE": "Manager Sales",
        "DESCRIPTION": "Documentación de la API de gestión de ventas.",
        "VERSION": "1.0.0",
    }
    
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
