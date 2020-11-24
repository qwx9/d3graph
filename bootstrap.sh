#!/bin/sh
export FLASK_APP=main.py
export FLASK_ENV=development
. $(pipenv --venv)/bin/activate
flask run
