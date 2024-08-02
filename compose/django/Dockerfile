# While an Alpine-based container would be preferable, we use a glibc-based
# container because there are only have manylinux wheels for numpy and scipy.
# See here: https://github.com/numpy/numpy/issues/20089
FROM python:3.12-slim

SHELL ["/bin/bash", "-c"]

ENV PYTHONUNBUFFERED 1

ARG USER_ID
ARG GROUP_ID

#
# System dependencies for Python + Django
#
RUN apt-get update \
  && apt-get install --yes apt-utils \
  # envsubst: gettext-base \
  # Pillow requirements: libjpeg, libtiff, zlib1g, libfreetype6, liblcms2 \
  # psycopg2 requirements: libpq \
  && apt-get install --yes \
    gettext-base \
    git gcc g++ \
    libjpeg-dev \
    libtiff-dev \
    zlib1g-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libpq-dev \
    python3-dev \
    python3-venv \
    python3-pip \
    python3-pytest \
    libhdf5-dev libnetcdf-dev \
    libgtk-3-0 libdbus-glib-1-2

# clean up image
RUN apt-get -qy autoremove

#
# Install requirements for TopoBank
#
WORKDIR /

# Here the entrypoint from production settings is taken!
COPY ./compose/django/scripts /scripts
RUN chmod +x /scripts/*.sh

RUN addgroup django --gid ${GROUP_ID} \
    && adduser --ingroup django --uid ${USER_ID} --gecos "" --disabled-password django
# or using --system? Problems with permissions?
# celeryworker should not run as root, refuses to work
#
# TODO check, can we use --disabled-login ??

RUN mkdir /venv && chown -R django.django /venv
RUN chown -R django.django /scripts

#
# Finalize..
#
WORKDIR /development-stack/topobank

USER django

ENTRYPOINT ["/scripts/entrypoint.sh"]
