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
  - You will then be prompted for the password you just gave on step 2. `Password for user postgres:`

5. Once everyhting is validated you can just run `psql -U postgres -h localhost`, and that will

### Once you enter said password you should see this your terminal.

![This](./assets/screenshot.png)

# curl command

`curl -d '{"username": "Chris"}' -H "Content-Type: application/json" -X POST localhost:3000/user`

- Body of curl user login:
  `BODY='{"email":"st8razed@gmail.com","firstName":"chris","lastName":"forti","password":"pa55word"}'`
- The run your curl
  ` curl -d "$BODY" -H 'Content-Type: application/json' localhost:3000/users/login`
- then capture token hash
  `{"message":"User retrieved successfully","token":"LGMwu7cD8cmhPDpJ8JqD27SGpjzaHmqeUgHr6i97vko"}% `
- `BODY='{"email": "st8razed@gmail.com", "password": "somepassword"}'`
  - `curl -d "$BODY"  -H "Content-Type: application/json" -X PUT http://localhost:3000/users/reset`

## userModel suggestions from chad

1. **Combine First Name and Last Name into a Single Name**: The code attempts to combine `firstName` and `lastName` into a `name` object. It's important to ensure that this combined data structure aligns with the database schema requirements.

2. **Email Validation**: The regular expression used to validate the email may not cover all valid email formats. Consider using a more robust email validation technique.

3. **Password Hashing**: The code correctly uses `bcrypt` to hash the password. Ensure that you handle any potential errors that may occur during the hashing process.

4. **SQL Injection Prevention**: The current implementation of the SQL query is vulnerable to SQL injection as it directly inserts user data into the query. Consider using parameterized queries to prevent SQL injection attacks.

5. **Error Handling**: The error handling in the `createUser` method could be improved. Instead of generic error messages, provide more specific information about what went wrong and handle errors more gracefully.

6. **Return User Model**: When an error occurs during the user creation process, the method always throws a generic error message. It would be more informative to return `null` in this case and handle the error differently.

# to finish

- attach all params to the req.whatever by relocating ensure authenticate, which then can be called inside the route handler, which I also need to add. (Start here)[https://github.com/michaelatimore/express-snippet-box/blob/main/src/middleware/auth.ts]

## token

"ttDmfeckgKtRan0R1se9RhH2_GdKByu2GB2ABHZQnPg"

## curl commands to reset password
