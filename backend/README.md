# Order Sales

Este proyecto tiene como objectivo funcionar como entregable de actividad para la materia de Analisis e interpretacion de datos dentro de la UNITEC,
este proyecto tiene fines academicos

## Como ejecutar

Para usar este proyecto en un entorno local es necesario tener intalado la version 3.10 de Python o superior, este proyecto fue construido en base al motor de poetry para el manejo del entorno, en caso de querer indagar, recomendamos la documentacion oficial https://python-poetry.org/docs/cli/

Este proyecto puede igualmente ser instalado con pip de la siguiente manera:

### Linux
```
python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
```

Una vez instalado tienes que configurar la base de datos, para este proyecto se configuro un docker compose el cual permite hacer este paso mas rapido, en caso de no querer usar docker-compose, instale su host de base de datos postgresql y llene la informacion en las variables de entornos

pasos para correr docker-compose:

si estas en un entorno local, sera suficiente con copiar el arcivo .env.example en un .env y correr el proyecto

```
cp .env.example .env
docker-compose up -d
```
Una vez instalado la base de datos y tener esta parte lista, hay que correr las migraciones con el siguiente comando:

```
python3 src/manage.py migrate
```

siempre que jales codigo, consulta con el desarrollador encargo del backend si hay alguna actualizacion de la base de datos para correr este comando nuevamente

Una vez listo tienes que crear un super usuario de Django:

```
python3 src/manage.py createsuperuser
```

sigues los pasos en la terminal

Posterior a ello inicia el entorno:

```
python3 src/manage.py runserver
```

Si todo ha malido bien 👀 podras abrir las siguientes paginas:

```
http://127.0.0.1:8000/admin/
http://127.0.0.1:8000/api/schema/swagger-ui/
```

Para ingresar en el admin de Django, usa el usuario y password creado, e igualmente en la documentacion de Swagger usa las mismas credenciales para autenticarte
