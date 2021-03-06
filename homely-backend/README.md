# homely backend

[Build a To-Do application Using Django and React](https://scotch.io/tutorials/build-a-to-do-application-using-django-and-react?fbclid=IwAR3KwFbzFGKKPgKf3sgh5cE2ZpuQKmGq_Zi1Ff2613J-d6s-F5CM4m4Fcu4)

To use this backend, first make sure you have Python 3 installed.

```
python --version
```

To install Python 3 you can use pyenv.

If you are using macOS, you can install it using Homebrew:

```
brew update
brew install pyenv
```

On a Linux system using the bash shell:

```
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
```

Once installed, you can run the following commands to install Python 3.

```
pyenv install 3.6.3
pyenv global 3.6.3
```

Your ReST API will use some third-party code (libraries) to help you (e.g. to connect to a database, to create schemas for your models, and validate whether the incoming requests are authenticated or not). Python has a powerful tool to manage dependencies called pipenv. To install pipenv on your machine follow these steps:

On macOS:

```
brew install pipenv
pip install --user pipenv
```

Run the following command to install django:

```
pipenv install django
pipenv install pillow
```

Install djangorestframework and django-cors-headers:

```
pipenv install djangorestframework django-cors-headers
```

```
pipenv install django-rest-knox
```

Run Server:

```
python manage.py runserver
```

Access admin interface at http://localhost:8000/admin::

```
python manage.py createsuperuser
```

`homely-backend/backend/homely` contains the pertinent django models and files.

Here is a list of routes:
User APIs: http://localhost:8000/api/users
Todo APIs: http://localhost:8000/api/todos

Register: http://localhost:8000/api/register
{
	"username": "",
	"email": "",
	"first_name": "",
	"last_name": "",
	"password": ""
}

Login: http://localhost:8000/api/auth/login
{
  "username" : "",
  "password" : ""
}
Login returns a token that is used to for User API:

User API by Token: http://localhost:8000/api/auth/user
Header:
{
  "Authorization" : "Token <INSERT TOKEN HERE>"
}

Logout: http://localhost:8000/api/auth/logout
(This invalidates the token)
