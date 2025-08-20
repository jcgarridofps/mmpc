# Django README

Django is a high-level Python web framework that enables rapid development of secure and maintainable websites. It follows the Model-View-Template (MVT) architectural pattern and emphasizes reusability and "pluggability" of components.

## Common Parameters

Below are some of the common Django management commands and their uses:

### makemigrations

The `makemigrations` management command is used to create new migration files based on the changes you have made to your models. This command is run whenever you make changes to your models, such as adding or removing fields.

```sh
$ python manage.py makemigrations <<app, for example mmpc>>
```

### migrate

The `migrate` management command is used to apply and unapply migrations. This command is run after you have created migrations with the `makemigrations` command, and is used to update your database schema to match the current state of your models.

```sh
$ python manage.py migrate <<app, for example mmpc>>
```

### runserver

The `runserver` management command is used to start the development server. This command is used to serve your application during development, and is not meant to be used in production.

```sh
$ python manage.py runserver
```

### createsuperuser

The `createsuperuser` management command is used to create a new superuser account. Superuser accounts have full access to the admin interface and all parts of the system.

```sh
$ python manage.py createsuperuser
```

These are just a few of the most commonly used Django management commands. For a full list of available commands, you can run `python manage.py help`.


