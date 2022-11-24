TopoBank development stack
==========================

This repository contains a docker-compose stack for developing TopoBank and
plugins.

The modules

* `topobank <https://github.com/ContactEngineering/topobank>`_
* `topobank-statistics <https://github.com/ContactEngineering/topobank-statistics>`_
* `topobank-contact <https://github.com/ContactEngineering/topobank-contact>`_

are included as submodules. The stack consists of

* the main *topobank* instance,
* `Celery <https://github.com/celery/celery>`_ workers and beat,
* a `PostgreSQL <https://www.postgresql.org/>`_ database,
* a `Redis <https://redis.io/>`_ server and
* a `Minio <https://min.io/>`_ S3 server.

Cloning
-------

This repository uses `git submodules <https://git-scm.com/book/en/v2/Git-Tools-Submodules>`_. 
You need to initialize and update them after cloning this repository, i.e. with

.. code-block::

    git clone https://github.com/ContactEngineering/topobank-stack-development.git
    cd topobank-stack-development/
    git submodule init
    git submodule update

Compiling
---------

To compile the stack, run

.. code-block::

    TOPOBANK_UID=$(id -u) TOPOBANK_GID=$(id -g) docker compose build

Note that you need the `compose <https://docs.docker.com/compose/install/linux/>`_
plugin of docker or the standalone `docker-compose <https://github.com/docker/compose>`_.

Running
-------

Run the whole stack with

.. code-block::

   docker compose up

The stack automatically intitializes the database and creates and S3 bucket.

Funding
-------

Development of this project is funded by the `European Research Council <https://erc.europa.eu>`_ within `Starting Grant 757343 <https://cordis.europa.eu/project/id/757343>`_.
