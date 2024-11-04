FROM python:3.12 AS build

WORKDIR /app

COPY . /app
ADD https://astral.sh/uv/0.4.29/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh
ENV PATH="/root/.cargo/bin:$PATH"

COPY ./pyproject.toml ./uv.lock ./
RUN uv sync --frozen

# While an Alpine-based container would be preferable, we use a glibc-based
# container because there are only have manylinux wheels for numpy and scipy.
# See here: https://github.com/numpy/numpy/issues/20089
FROM python:3.12-slim

# NOTE: OCI annotations: https://specs.opencontainers.org/image-spec/annotations/
LABEL org.opencontainers.image.title="Topobank"
LABEL org.opencontainers.image.description="A surface metrology cloud database."
LABEL org.opencontainers.image.authors="Michael Röttger <info@michael-roettger.de>, Lars Pastewka <lars.pastewka@imtek.uni-freiburg.de>, Ioannis Nezis <ioannis@nezis.de>"
LABEL org.opencontainers.image.url="https://contact.engineering/"
LABEL org.opencontainers.image.source="https://github.com/ContactEngineering/topobank"
LABEL org.opencontainers.image.documentation="https://github.com/ContactEngineering/topobank/blob/main/README.rst"
# TODO: LABEL org.opencontainers.image.version=

SHELL ["/bin/bash", "-c"]

ENV PYTHONUNBUFFERED=1

ARG USER_ID
ARG GROUP_ID

RUN apt-get update \
  && apt-get install --yes apt-utils \
  # envsubst: gettext-base \
  # Pillow requirements: libjpeg, libtiff, zlib1g, libfreetype6, liblcms2 \
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

WORKDIR /app/topobank

COPY  . /app

COPY --from=build /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Here the entrypoint from production settings is taken!
COPY ./compose/django/scripts /scripts
RUN chmod +x /scripts/*.sh
#
# RUN addgroup django --gid ${GROUP_ID} \
#   && adduser --ingroup django --uid ${USER_ID} --gecos "" --disabled-password django
# # or using --system? Problems with permissions?
# # celeryworker should not run as root, refuses to work
# #
# # TODO: check, can we use --disabled-login ??


# USER django

ENTRYPOINT ["/scripts/entrypoint.sh"]
CMD ["/scripts/start-gunicorn.sh"]
