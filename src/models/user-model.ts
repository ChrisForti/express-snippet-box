import type pg from "pg";
import bcrypt from "bcrypt";
import assert from "assert";

type UserModel = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export class Users {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }

  async updatePassword(userIdFromToken: string, hashedPassword: string) {
    try {
      const sql = "UPDATE users SET password = $1 WHERE id = $2";
      const params = [hashedPassword, userIdFromToken];
      await this.pool.query(sql, params);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const emailRx =
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
    try {
      if (!firstName || !lastName) {
        throw new Error("First and last name are required");
      }
      if (firstName.length < 3 || lastName.length < 3) {
        throw new Error(
          "First and last shoud be a minimum of three characters"
        );
      }

      if (!email) {
        throw new Error("Email address is required");
      }
      if (!email.match(emailRx)) {
        throw new Error("Invalid email format");
      }

      if (!password) {
        throw new Error("password is missing");
      }
      if (password.length < 8 || password.length > 32) {
        throw new Error("password must be between 8, and 32 characters");
      }

      // hash password then check for a falsy password hash
      const passwordHash = await bcrypt.hash(password, 10);
      if (!passwordHash) {
        throw new Error("Error hashing the password");
      }

      const sql =
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at";
      const params = [firstName, lastName, email, passwordHash];
      const client = await this.pool.query(sql, params);

      // create user to return
      return {
        id: client.rows[0].id,
        firstName,
        lastName,
        email,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  async userLogin(email: string, password: string) {
    // Validate email and password
    if (!email) {
      throw new Error("Email is missing");
    }
    const emailRx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email.match(emailRx)) {
      throw new Error("Invalid email format");
    }
    if (!password) {
      throw new Error("Password is missing");
    }
    if (password.length < 8) {
      throw new Error("Minimum password length is 8 characters");
    }

    try {
      // Get user from the database by email
      const result = await this.pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      // Get the user
      const user = result.rows[0];

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Credentials invalid");
      }

      if (!user.email_verified) {
        throw new Error("Email not verified");
      }

      // Return the user and token if login is successful
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      };
    } catch (err) {
      console.error("Login failed: ", err);
      return null;
    }
  }

  async getUserByEmail(email: string) {
    const result = await this.pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }
    return {
      id: result.rows[0].id,
      email: result.rows[0].email,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      passwordHash: result.rows[0].password,
    };
  }

  async getUserById(id: number) {
    try {
      if (!id) {
        throw new Error("user id is missing");
      }
      if (!Number.isInteger(id) || id < 1) {
        throw new Error("user id must be a number");
      }

      const result = await this.pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
      return {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
      };
    } catch (error) {
      console.error("Failed to get user by ID: ", error);
      return null;
    }
  }

  async updateUser(
    id: number,
    email?: string,
    firstName?: string,
    lastName?: string,
    password?: string
  ) {
    try {
      let updateUserQuery = "UPDATE users SET ";
      const params: any[] = [id];

      // Append params
      if (email) {
        updateUserQuery += "email = $2, ";
        params.push(email);
      }
      if (firstName) {
        updateUserQuery += "first_name = $3, ";
        params.push(firstName);
      }
      if (lastName) {
        updateUserQuery += "last_name = $4, ";
        params.push(lastName);
      }
      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        updateUserQuery += "password = $5, ";
        params.push(passwordHash);
      }

      updateUserQuery = updateUserQuery.trim().replace(/, $/, "");

      // Complete the query by adding the condition to update the specific user
      updateUserQuery +=
        " WHERE id = $1 RETURNING id, email, first_name, last_name";

      // Execute the query with the parameters
      const result = await this.pool.query(updateUserQuery, params);

      // Check if the user was found and updated
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      // Return the updated user information
      return {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
      };
    } catch (error) {
      console.error("Failed to update user: ", error);
      return null;
    }
  }

  async deleteUser(id: number) {
    if (!id) {
      throw new Error("user id is missing");
    }
    if (!Number.isInteger(id) || id < 1) {
      throw new Error("user id must be a number");
    }

    try {
      const result = await this.pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [id]
      );
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
      return { id: result.rows[0].id };
    } catch (error) {
      console.error("Failed to delete user: ", error);
      return null;
    }
  }
}
