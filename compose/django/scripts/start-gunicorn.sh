#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

echo "-> Running database migrations..."
python manage.py migrate

echo "-> Registering analysis functions..."
python manage.py register_analysis_functions

# make sure that the ORCID social app for django-all-auth is configured
#
# The template file 'orcid.yaml.template' was created by
#  python manage.py dumpdata --settings=config.settings.local -o orcid.yaml socialaccount.socialapp
# plus replaced the values of "client_id" and "secret" with environment variables.
#

#echo "-> Collecting static files.."
#python manage.py collectstatic --noinput

echo "-> ** Skipping collection of static files..." **

echo "-> Loading data for ORCID authentication..."
# create yaml file with actual values of environment variables
envsubst < orcid.yaml.template > orcid.yaml

# python manage.py loaddata -v 2 orcid.yaml

# python manage.py dumpdata -a -o dumpdata.yaml

echo "-> Starting application for local development..."
#python manage.py runserver_plus --keep-meta-shutdown 0.0.0.0:8000
exec uvicorn topobank.asgi:application --lifespan on --host 0.0.0.0 --reload --reload-include '*.html' --reload-include '*.js'
