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
plugin of docker or the (old) standalone `docker-compose <https://pypi.org/project/docker-compose/>`_ that can be installed via `pip`.

You could also copy the template file `.env.template` to `.env`
and fill in these two numbers, so you don't have to prefix the `docker compose` commands.

Running
-------

Run the whole stack with

.. code-block::

   docker compose up

The stack automatically intitializes the database and creates and S3 bucket.

When running the first time or each time when the static files have changed, run

.. code-block::

    docker compose run --rm django python manage.py collectstatic

to update the static files.

Also, when running the first time, in order to see the analysis function
from the plugins make sure that you've added an organization `World`, which
is linked to the group `all` and add permissions for all commonly available plugins:

1. First give your development user admin permissions such that you can
   enter the admin interface:

   .. code-block::

    docker compose run --rm django manage.py grant_admin_permissions your_username

   You have to replace `your_user`. In order to find it, login with your ORCID
   and enter the "User Profile" page and take the last part of the URL.
   Example: If the URL is `https://contact.engineering/users/anna/`, then `your_username` is `anna`.

2. After granting the permission, you can enter the admin page. The link to the admin page
   can be found by this user in the menu item which is named after the user.

3. In the `Organization` model, create a new organization with name `World`. As available plugins,
   enter e.g. `topobank_contact, topobank_statistics`. As group, choose `all`.

Then all users, including the anonymous user, will be able the use the mentioned plugins.

Funding
-------

Development of this project is funded by the `European Research Council <https://erc.europa.eu>`_ within `Starting Grant 757343 <https://cordis.europa.eu/project/id/757343>`_.
