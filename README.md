# Snippet Box API

This is a strictly backend Api that will serve snippets of code, and uses postgres as a Database. This is my first fullstack project.

## Getting started

1. First you want to make sure you are in a directory, within your file system. That you would like to house this repo, and then clone the repository.

   - **SSH** run: `git clone git@github.com:ChrisForti/express-snippet-box.git`

2. Then move into the code base

- `cd express-snippet-box`

3. Install your node_modules

- `npm install`

## Usage

4. Get docker online, and run the postgres container:

- If you have not already created a container from the project dependant image see [DOC.md](DOC.md)
- **In your terminal:**
  - In this project run:
    `npm run psql`
  - If not operating in this codebase, or just like the hardway run:
    `psql -U postgres -h localhost`
  - **For the basic GUI `adminer`:**
    `curl -X POST localhost:8080/user`
    - Then navigate to `localhost:8080` in your browser.

5. Once you are linked up, run the server:

- `npm run dev`

  **You can also start the containers detached**

- `docker-compose up -d`
  **then to stop them:**
- `docker-compose down`

### Built with

![NPM Current (with tag)](https://img.shields.io/npm/v/npm.svg?logo=nodedotjs)
![Javascrit Current (with tag)](https://img.shields.io/badge/javascript-blue?logo=javascript)
![typescript Current (with tag)](https://img.shields.io/badge/TypeScript-v5.6.2-blue)
![Docker Pulls](https://img.shields.io/docker/pulls/:user/:repo)
