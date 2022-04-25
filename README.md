# RUCOGS Website Backend

The backend to our website. It hosts a database containing all our projects and will be linked to the discord bot.

## Running

To run both the backend, run

```bash
> docker-compose up --build
```

## Notes

Currently we are using an [old version of nodejs typescript types to keep mongoose happy](https://stackoverflow.com/questions/70607218/error-importing-mongodb-with-typescript).

`package.json` must have LF line endings.

## Contributing

Note that configurations files are not included in the repository because they contain sensistive information. Please reach out to @Atlinx if you are a part of the COGS e-board and need the files.