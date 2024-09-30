# Postgres VIA docker, initialize steps

- Set up dependencies for postgres on mac
  - `brew install libpq`
  - Check if its there: `which psql`
- Next login to docker, and get it online,
  - Once inside docker set up special params:

1. name of project
2. POSTGRES_PASSWORD password
3. bind port 5432:5432
   **then in your terminal run:**

- `docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres`
- Then run: `psql -U postgres -h localhost`
  **You should see**
  ![This](./assets/screenshot.png)
