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

or use a command like

.. code-block::

    git clone --recurse-submodules git@github.com:ContactEngineering/topobank-stack-development.git

Configuring
-----------

Enter the project directory:

.. code-block::

    cd topobank-stack-development

In order to run the application, copy the configuration template by

.. code-block::

    cp .envs/.django.template .envs/.django

and edit the file :code:`.envs/.django` according to your needs, fill out the values needed.

What you absolutely need to replace the values here:

.. code-block::

    ORCID_CLIENT_ID=<replace with your client ID from ORCID>
    ORCID_SECRET=<replace with your secret from ORCID>

In order to find these values, register a public API client (see next chapter).

If you want to create test DOIs from the application, also provide values
for :code:`DATACITE_USERNAME`, :code:`DATACITE_PASSWORD`, and :code:`PUBLICATION_DOI_PREFIX`.
By default the DOI generation is skipped.

The rest of the settings should be fine as default for development.

Register a Public API Client
............................

You need to register a public API client on the ORCID website
for the following purposes:

- get a client API + secret in order to be able to authenticate against orcid.org
- set a redirect URL to which Topobank will redirect after successful authentication

See `here <https://support.orcid.org/hc/en-us/articles/360006897174>`_ for more information
how to do it.
As redirect URL add all of these

- for development: http://127.0.0.1:8000/accounts/orcid/login/callback
- for development: http://localhost:8000/accounts/orcid/login/callback

One of the redirect URL configured at orcid.org must exactly match the redirect URL, which is
transferred from the TopoBank application during the login process.
This means, if you use

 http://localhost:8000

i.e. :code:`localhost` instead of :code:`127.0.0.1` during development, you'll need also redirect
url with :code:`localhost` which is

 http://localhost:8000/accounts/orcid/login/callback

If you have both :code:`localhost` and :code:`127.0.0.1`, it shoudn't matter.

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

Running
-------

Run the whole stack with

.. code-block::

   docker compose up

The stack automatically initializes the database and creates an S3 bucket.

You are now able to log in with via ORCID and upload data, but you will not have access to any analysis functionality yet.

When running the first time or each time when the static files have changed, run

.. code-block::

    docker compose run --rm django python manage.py collectstatic

to update the static files.

Also, when running the first time, in order to see the analysis function
from the plugins make sure that you've added an organization :code:`World`, which
is linked to the group :code:`all` and add permissions for all commonly available plugins:

1. First give your development user admin permissions such that you can
   enter the admin interface:

   .. code-block::

    docker compose run --rm django python manage.py grant_admin_permissions your_username

   You have to replace :code:`your_username` with the correct username.
   In order to find it, login with your ORCID
   and enter the "User Profile" page and take the last part of the URL.
   Example: If the URL is :code:`https://localhost:8000/users/anna/`, then :code:`your_username` is :code:`anna`.

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

    TOPOBANK_PLUGINS="topobank-statistics topobank-contact"

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

Funding
-------

Development of this project is funded by the `European Research Council <https://erc.europa.eu>`_ within `Starting Grant 757343 <https://cordis.europa.eu/project/id/757343>`_.

