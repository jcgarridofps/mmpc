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

echo '------ Starting up Django server for production ------'

pipenv run gunicorn api.asgi:application --bind 0.0.0.0:8000 --workers 2 -k uvicorn.workers.UvicornWorker --reload #run ASGI application with websocket ---PRODUCTION--- 


#change to LF