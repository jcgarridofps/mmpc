#!/bin/sh
set -e

echo '------ Update Django migrations all apps ------'
		# create and apply migrations mmpc app
	pipenv run python manage.py makemigrations mmpc
	pipenv run python manage.py migrate mmpc

	# create and apply migrations auth app
	pipenv run python manage.py makemigrations auth
	pipenv run python manage.py migrate auth

	# create and apply other apps
	pipenv run python manage.py makemigrations
	pipenv run python manage.py migrate

echo '------ Starting up development Django server with debug capabilities with debugpy ------'

exec pipenv run python3 -Xfrozen_modules=off -m debugpy --listen 0.0.0.0:3002 $(pipenv --venv)/bin/gunicorn api.asgi:application --bind 0.0.0.0:8001 --pid ./gunicorn.pid --workers 2 -k uvicorn.workers.UvicornWorker --reload

echo '---Please attach debugpy client debugger when ready---'
	
#change to LF