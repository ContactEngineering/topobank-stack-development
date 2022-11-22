FROM continuumio/miniconda3
# FROM ubuntu:18.04
#FROM python:3.7-alpine

ENV PYTHONUNBUFFERED 1
ENV CFLAGS "-I/usr/include/eigen3/"
# This is a workaround for https://gitlab.com/muspectre/muspectre/-/issues/144

ARG USER_ID
ARG GROUP_ID

#
# System dependencies for Python + Django
#
RUN apt-get update \
  && apt-get install --yes apt-utils \
  && apt-get install --yes libfftw3-3 libfftw3-dev libopenblas-base libopenblas-dev libeigen3-dev gcc g++ gettext \
  # Pillow requirements
  && apt-get install --yes libjpeg-dev zlib1g-dev libfreetype6-dev \
     liblcms2-dev libtiff-dev tk-dev tcl-dev librabbitmq-dev \
  # Requirements in order to built libmufft
  # (curl is used to download pybind11 and Eigen3)
  && apt-get install --yes curl \
  # && apt-get install --yes mpicc libfftw3-mpi-dev
  # && apt-get install --yes clang-5 libfftw3-dev
  && apt-get install --yes libmemcached-dev \
  && apt-get install --yes libnetcdf-dev

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

COPY ./requirements/development.txt /requirements/development.txt
RUN pip install -r /requirements/development.txt --ignore-installed --no-binary numpy


# Here the entrypoint from production settings is taken!
COPY ./compose/django/entrypoint /entrypoint
RUN sed -i 's/\r//' /entrypoint
RUN chmod +x /entrypoint

COPY ./compose/django/start /start
RUN sed -i 's/\r//' /start
RUN chmod +x /start

COPY ./compose/django/celery/worker/start /start-celeryworker
RUN sed -i 's/\r//' /start-celeryworker
RUN chmod +x /start-celeryworker

COPY ./compose/django/celery/beat/start /start-celerybeat
RUN sed -i 's/\r//' /start-celerybeat
RUN chmod +x /start-celerybeat

# COPY ./compose/django/celery/flower/start /start-flower
# RUN sed -i 's/\r//' /start-flower
# RUN chmod +x /start-flower

RUN addgroup django --gid ${GROUP_ID} \
    && adduser --ingroup django --uid ${USER_ID} --gecos "" --disabled-password django
# or using --system? Problems with permissions?
# celeryworker should not run as root, refuses to work
#
# TODO check, can we use --disabled-login ??

#
# Finalize..
#
WORKDIR /app-topobank

USER django

ENTRYPOINT ["/entrypoint"]
