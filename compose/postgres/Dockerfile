FROM postgres:17.5

# The docker image automatically creates user+password+database if the appropriate
# environment variables are set, see here:
#  https://docs.docker.com/samples/library/postgres/

COPY ./compose/postgres/maintenance /usr/local/bin/maintenance
RUN chmod +x /usr/local/bin/maintenance/*
RUN mv /usr/local/bin/maintenance/* /usr/local/bin && rmdir /usr/local/bin/maintenance

# Needed, otherwise error "exec: \docker-entrypoint.sh\: executable file not found in $PATH"
RUN chmod 777 /usr/local/bin/docker-entrypoint.sh && ln -s /usr/local/bin/docker-entrypoint.sh /
