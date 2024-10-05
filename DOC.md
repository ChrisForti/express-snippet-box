# Postgres VIA docker, initialize steps

- Set up dependencies for postgres on mac
  - `brew install libpq`
  - Check if its there: `which psql`
- Next login to docker, and get it online,
  - Once inside docker set up Optional settings:

1. name of project
2. POSTGRES_PASSWORD password
3. bind port 5432:5432
   **then in your terminal run:**

- `docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres`
- Then run: `psql -U postgres -h localhost`
  - You will then be prompted for the password you justgave on step 2. `Password for user postgres:`

### Once you enter said password you should see this your terminal.

![This](./assets/screenshot.png)
