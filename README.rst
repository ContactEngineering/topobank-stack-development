TopoBank development stack
==========================

This repository contains a docker-compose stack for developing TopoBank and
plugins.

The modules

* `topobank <https://github.com/ContactEngineering/topobank>`_
* `topobank-statistics <https://github.com/ContactEngineering/topobank-statistics>`_
* `topobank-contact <https://github.com/ContactEngineering/topobank-contact>`_
* `topobank-publication <https://github.com/ContactEngineering/topobank-publication>`_
* `ce-ui <https://github.com/ContactEngineering/ce-ui>`_

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

or use a command like

.. code-block::

    git clone --recurse-submodules git@github.com:ContactEngineering/topobank-stack-development.git

If you need to clone without github credentials available locally,
please modify URLs within the `.gitmodules` file to point to public addresses, e.g.

    https://github.com/ContactEngineering/topobank.git

instead of

    git@github.com:ContactEngineering/TopoBank.git

and run

.. code-block::

    git submodule sync --recursive

afterwards.

After initializing and updating the submodules, use

.. code-block::

     git submodule foreach git pull origin main

to pull all current main branches from remote.

Configuring
-----------

Enter the project directory:

.. code-block::

    cd topobank-stack-development

In order to run the application, copy the orcid configuration template by

.. code-block::

    cp .envs/.orcid.template .envs/.orcid

and edit the file :code:`.envs/.orcid` and replace the values here:

.. code-block::

    ORCID_CLIENT_ID=<replace with your client ID from ORCID>
    ORCID_SECRET=<replace with your secret from ORCID>

In order to find these values, register a public API client (see next chapter).

If you want to create test DOIs from the application, also copy and the datacite configuration template by

.. code-block::

   cp .envs/.datacite.template .envs/.datacite

This is **Optional**, by default the DOI generation is skipped.

The rest of the settings in :code:`.envs/.django` should be fine as default for development.

Register a public API client
............................

You need to register a public API client on the ORCID website
for the following purposes:

- get a client API + secret in order to be able to authenticate against orcid.org
- set a redirect URL to which Topobank will redirect after successful authentication

See `here <https://info.orcid.org/documentation/integration-guide/registering-a-public-api-client/>`_ for more information
how to do it.
As redirect URL add `http://127.0.0.1:8000/accounts/orcid/login/callback`

Compiling
---------

To compile the stack, run

.. code-block::

    TOPOBANK_UID=$(id -u) TOPOBANK_GID=$(id -g) docker compose build

Note that you need the `compose <https://docs.docker.com/compose/install/linux/>`_
plugin of docker or the (old) standalone `docker-compose <https://pypi.org/project/docker-compose/>`_ that can be
installed via :code:`pip`.

You could also copy the template file :code:`.env.template` to :code:`.env`
and fill in these two numbers, so you don't have to prefix the :code:`docker compose` commands.
You can find the ids by calling the :code:`id` command on Linux, this will return the :code:`uid` and possible
:code:`gid` values.

**Important**: If you have VPN active, this may shadow the Docker mirror sites and break the build process (because the images cannot be pulled).

Running (locally)
-----------------

Run the whole stack with

.. code-block::

   docker compose up -d

The stack automatically initializes the database and creates an S3 bucket.

Especially the first time, this could take a while.
To see what is going on, you can look at the `logs` with:

.. code-block::

    docker compose logs -f

If you only want to see the `logs` of one Service, i.e. `django`, run:

.. code-block::

    docker compose logs -f django

You are now able to log in with via ORCID and upload data, but you will not have access to any analysis functionality yet.

When running the first time, in order to see the analysis function
from the plugins make sure that you've added an organization :code:`World`, which
is linked to the group :code:`all` and add permissions for all commonly available plugins:

1. First give your development user admin permissions such that you can
   enter the admin interface:

   .. code-block::

    docker compose exec django python manage.py grant_admin_permissions your_username

   You have to replace :code:`your_username` with the correct username.
   In order to find it, login with your ORCID
   and enter the "User Profile" page and take the last part of the URL.
   Example: If the URL is :code:`https://127.0.0.1:8000/users/anna/`, then :code:`your_username` is :code:`anna`.

2. After granting the permission, you can enter the admin page. The link to the admin page
   can be found by this user in the menu item which is named after the user.

3. In the :code:`Organization` model, create a new organization with name :code:`World`. As available plugins,
   enter e.g. :code:`topobank_contact, topobank_statistics`. Pay attention to suing underscores where otherwise dashes appear.
   As group, choose :code:`all`.

Then all users, including the anonymous user, will be able the use the mentioned plugins.

To have the topobank platform communicate with the local minio s3 server,
you will aso have to add :code:`topobank-minio-alias` as another name for :code:`localhost` to your :code:`/etc/hosts` file, e.g.

.. code-block::

    127.0.0.1 localhost topobank-minio-alias

Updating plugins
----------------

List all submodules in the :code:`.envs/.django` in a line

.. code-block::

    TOPOBANK_PLUGINS="topobank-statistics topobank-contact topobank-publication ce-ui"

separated by whitespace.

When requirements in submodules change, update
:code:`requirements/development.txt` by providing :code:`pip-compile`
and running :code:`make` from within :code:`requirements`.

Plugins with private dependencies may require access tokens provided
in environment variables during this process. These secret tokens
will be embedded as *clear text* in :code:`requirements/development.txt`.
Thus, do not commit this requirements file.

Make sure all submodules point to the head of the respective branch
you want to use in your development stack.

Running a shell
---------------

.. code-block::

    docker compose run --rm django python manage.py shell

Testing (in PyCharm)
--------------------

To configure tests in PyCharm, please consider the following:

* In `File->Settings->Docker->Tools` enable Docker Compose V2
* Create a new interpreter `On Docker Compose...` that runs within the compose configuration
* Make sure that the python interpreter is `/venv/bin/python3`
* Create a new `pytest` configuration that runs within this interpreter. Add
  `DJANGO_SETTINGS_MODULE=topobank.settings.test` to the environment.

Import a database dump
----------------------

Copy the database dump file to the `/backups` location in the PostgreSQL container:

.. code-block::

    docker cp file.sql container:/backups

Open a shell in the PostgreSQL container:

.. code-block::

    docker compose exec postgres /bin/bash

Run the import:

.. code-block::

    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER --dbname $POSTGRES_DB

Mock publishing
---------------

The web app includes functionality for publishing datasets, which means registering a DOI for those. The true DOI
registration only works in the production environment.

Funding
-------

Development of this project is funded by the `European Research Council <https://erc.europa.eu>`_ within `Starting Grant 757343 <https://cordis.europa.eu/project/id/757343>`_.

