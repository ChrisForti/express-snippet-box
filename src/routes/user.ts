import { Router } from "express";
import { pool } from "../db/db.js"; // I believe this needs to be {db} now
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";

type TokenModel = {
  plaintext: string;
  hash: string;
  expiry: number;
  userId: number;
};

const userRouter = Router();

userRouter.post("/", createUser);

type CreateUserBodyParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Route handler is now a controller to create a user
async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;

  try {
    const newUser = await db.Models.Users.createUser(
      email,
      firstName,
      lastName,
      password
    );
    res.status(201).json(newUser); // successful creation of a newUser
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  }
}
// async function createUser(req: Request, res: Response) {
//   const { email, firstName, lastName, password } =
//     req.body as CreateUserBodyParams;

//   const emailRx = //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
//     "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

//   if (!email) {
//     return res.status(400).json({ message: "email is missing" });
//   }
//   if (!email.match(emailRx)) {
//     return res.status(400).json({ message: "email format is invalid" });
//   }
//   if (!firstName) {
//     return res.status(400).json({ message: "first name is missing" });
//   }
//   if (!lastName) {
//     return res.status(400).json({ message: "last name is missing" });
//   }
//   if (!password) {
//     return res.status(400).json({ message: "password is missing" });
//   }
//   if (password.length < 8 || password.length > 500) {
//     return res
//       .status(400)
//       .json({ message: "password must be between 8, and 500 characters" });
//   }

//   // create an object that does not include password to pass down
//   try {
//     const passwordHash = await bcrypt.hash(password, 10);
//     if (passwordHash === null) {
//       throw new Error("something went wrong inserting password");
//     }

//     // SQL prep for creating new user
//     const newUser = await pool.query(
//       "INSERT INTO users(email, first_name, last_name, password, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//       [email, firstName, lastName, passwordHash, false]
//     );
//     if (passwordHash === null) {
//       throw new Error("something went wrong inserting user");
//     }

//     res.status(201).json(newUser.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "new user was not created" });
//   }
// }

userRouter.post("/login", loginUser);

type loginUserBodyParams = {
  email: string;
  password: string;
};

// Route handler to login users
async function loginUser(req: Request, res: Response) {
  // get the users email and password from the body
  const { email, password: passwordHash } = req.body as loginUserBodyParams;
  console.log(req.body);

  if (!email) {
    return res.status(400).json({ message: "email is missing" });
  }
  if (!passwordHash) {
    return res.status(400).json({ message: "password is missing" });
  }

  // validate email and password
  const emailRx = //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email.match(emailRx)) {
    return res.status(400).json({ message: "email format is invalid" });
  }
  if (passwordHash.length < 8 || passwordHash.length > 500) {
    return res
      .status(400)
      .json({ message: "password must be between 8, and 500 characters" });
  }

  // get user from database by email
  try {
    const getUserByEmail = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(getUserByEmail, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    const user = result.rows[0];

    // use bcrypt.compare to verify password is correct
    // https://www.npmjs.com/package/bcrypt
    const verifiedPassword = await bcrypt.compare(passwordHash, user.password);

    if (!verifiedPassword) {
      return res.status(401).json({ message: "Credentials invalid" });
    }

    const plaintext = randomBytes(32).toString();
    const hash = createHash("sha256").update(plaintext).digest("hex");
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60 * 24 * 30;

    const token: TokenModel = {
      plaintext,
      hash,
      expiry,
      userId: user.id,
    };

    const sql = "INSERT into tokens (hash, epiry, user_id)VALUES ($1, $2, $3)";
    const params = [token.hash, token.expiry, token.userId];
    await pool.query(sql, params);

    res
      .status(200)
      .json({ message: "User retrieved successfully", token: token.plaintext });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// research middleware
// https://www.usebruno.com/
// MVC model view controller

export { userRouter };
