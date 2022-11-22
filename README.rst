TopoBank development stack
==========================

This repository contains a docker-compose stack for developing TopoBank and
plugins.

The modules

* topobank
* topobank-statistics
* topobank-contact

are included as submodules. The stack consists of

* the main _topobank_ instance,
* `Celery <https://github.com/celery/celery>`_ workers and beat,
* a postgres database,
* a Redis server and
* a minio S3

server.

Compiling
---------

To compile the stack, run

.. code-block::

    docker compose build

Note that you need the `compose <https://docs.docker.com/compose/install/linux/>`_
plugin of docker or the standalone `docker-compose <https://github.com/docker/compose>`_.

Funding
-------

Development of this project is funded by the `European Research Council <https://erc.europa.eu>`_ within `Starting Grant 757343 <https://cordis.europa.eu/project/id/757343>`_.
