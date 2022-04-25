# RUCOGS Website Backend

The backend to our website. It hosts a database containing all our projects and will be linked to the discord bot.

## Running

To build and run the backend, run

```bash
> docker-compose up --build --force-recreate
```

If you want to completely reset the backend, run 

```bash
> docker-compose down --volumes
> docker-compose up --build --force-recreate
```

We need to run `docker-compose down --volumes` to delete the volume holding the database information. Then when the container is built again, the root database user can be created. The root database user will not be made if a database already exists.

## Notes

Currently we are using an [old version of nodejs typescript types to keep mongoose happy](https://stackoverflow.com/questions/70607218/error-importing-mongodb-with-typescript).

`package.json` must have LF line endings.

`MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` are used in docker compose for mongo to create a root user, storing it in the `admin` database. Note that if the admin database exists already, then no new root user will be added. This is why you must clear the volume if you want to update the root user.

`MONGO_INITDB_DATABASE` has nothing to do with `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD`.

## Contributing

Note that configurations files are not included in the repository because they contain sensistive information. Please reach out to @Atlinx if you are a part of the COGS e-board and need the files.