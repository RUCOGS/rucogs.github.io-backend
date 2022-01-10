FROM node:16

# Moves to the directory "container/app"
WORKDIR /app

# Copy over package.json files and installing them
# before copying over the actual program to let
# Docker cache the packages after installing them.
# If the packages aren't changed in the future,
# then Docker will not have to reinstall them.
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Only one CMD exists per dockerfile.
# Tells how to start the program.
CMD [ "npm", "start" ]