FROM bitnami/mariadb:latest

ENV MARIADB_ROOT_PASSWORD 'secured'

COPY *.sql /docker-entrypoint-initdb.d/

EXPOSE 3306