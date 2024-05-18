# RUCOGS Website Backend

The backend to our website. It hosts a database containing all our projects and will be linked to the discord bot.

Node Version: 20.13.1

## Running Backend Locally

To build and run the backend, run

```bash
> npm run start:rebuild
```

To recompile the typescript files and run the backend, without regenerating Typetta scripts, run,

```bash
> npm run start:recompile
```

## Setting Up Local Development

1. Clone this repository onto your machine.

2. Before you start development, you must have Node.js installed. "Node.js" is a runtime environment, and downloading it should also give you the "npm" package manager. You can download the latest version of Node.js with npm from [here](https://nodejs.org/en/download/).

3. Install all the relevant dependencies by running the following inside the folder containing the repository.

```bash
> npm i
```

4. Set up the configuration files. These files contain sensitive information, therefore they're omitted from the git repository. To make your own configuration files, you must copy the config templates inside the config folder and remove the `.template` part from the file such that your config files have a `.config.json` file ending.

## Backend Hosting (Linode)

1. [Installing apache on Linode](https://www.linode.com/content/apache-basics-tutorial-how-to-install-and-configure-apache2/)
2. [Installing apache to serve nodejs](https://blog.logrocket.com/configuring-apache-for-node-js/)
3. [Getting https cert with apache on ubuntu)](https://www.linode.com/docs/guides/enabling-https-using-certbot-with-apache-on-ubuntu/)
4. [Using git to manage a website](https://gist.github.com/Nilpo/8ed5e44be00d6cf21f22#ctl)
5. [Making nodejs app into linux service](https://blog.r0b.io/post/running-node-js-as-a-systemd-service/)
