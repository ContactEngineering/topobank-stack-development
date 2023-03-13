# While an Alpine-based container would be preferable, we use a glibc-based
# container because there are only have manylinux wheels for numpy and scipy.
# See here: https://github.com/numpy/numpy/issues/20089
FROM python:3.10-slim

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
    libpq-dev

# clean up image
RUN apt-get -qy autoremove

#
# Extra requirements for exporting plots in bokeh
#
RUN apt-get install --yes libgtk-3-0 libdbus-glib-1-2

# Upgrade pip, so package 'cryptography' does not need to be compiled with rust
RUN pip install --upgrade pip

#
# Install requirements for TopoBank
#
WORKDIR /
RUN pip install --upgrade setuptools

RUN --mount=type=cache,target=/root/.cache --mount=type=secret,id=development_txt pip install -r /run/secrets/development_txt --ignore-installed

# Here the entrypoint from production settings is taken!
COPY ./compose/django/scripts /scripts
RUN chmod +x /scripts/*.sh

RUN addgroup django --gid ${GROUP_ID} \
    && adduser --ingroup django --uid ${USER_ID} --gecos "" --disabled-password django
# or using --system? Problems with permissions?
# celeryworker should not run as root, refuses to work
#
# TODO check, can we use --disabled-login ??

RUN chown -R django.django /scripts

#
# Finalize..
#
WORKDIR /development-stack/topobank

USER django

ENTRYPOINT ["/scripts/entrypoint.sh"]
