# Snippet Box API

This is a strictly backend Api that will serve snippets of code, and uses postgres as a Database.

## Getting started

1. First you want to make sure you are in a directory, within your file system. That you would like to house this repo, and then clone the repository.

   - **SSH** run: `git clone git@github.com:ChrisForti/express-snippet-box.git`

2. Then move into the code base

- `cd express-snippet-box`

3. Install your node_modules

- `npm install`

## Usage

4. To start up docker, and access the model via the postgres container:

- `docker-compose up -d`
  **then to stop them:**
- `docker-compose down`

To run the server:

- `npm run dev`

### Built with

![NPM Current (with tag)](https://img.shields.io/npm/v/npm.svg?logo=nodedotjs)
![Javascrit Current (with tag)](https://img.shields.io/badge/javascript-blue?logo=javascript)
![typescript Current (with tag)](https://img.shields.io/badge/TypeScript-v5.6.2-blue)
