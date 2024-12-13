import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  validateEmail,
  validateId,
  validateName,
  validatePassword,
} from "../models/validators.js";
import { ensureAuthenticated } from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/", createUser);

userRouter.get("/", ensureAuthenticated, getUserById);
userRouter.put("/", ensureAuthenticated, updateUser);
userRouter.delete("/", ensureAuthenticated, deleteUser);

type CreateUserBodyParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Route controller to create a user
async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } =
    req.body as CreateUserBodyParams;
  const userId = req.user!.id;
  try {
    validateName(firstName, lastName);

    validateEmail(email);

    validatePassword(password);

    const newUser = await db.Models.Users.createUser(
      email,
      firstName,
      lastName,
      password
    );
    res.status(201).json(newUser); // 201 = created newUser
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: "Bad request" }); // More specific pattern
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  }
}

userRouter.post("/login", loginUser);

// type loginUserBodyParams = {
//   email: string;
//   password: string;
// };

// Route controller to login users
async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    validateEmail(email);

    validatePassword(password);

    const user = await db.Models.Users.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const verifiedPassword = await bcrypt.compare(password, user.passwordHash);

    if (!verifiedPassword) {
      return res.status(401).json({ message: "Credentials invalid" });
    }

    const plaintext = db.Models.Tokens.generateAuthenticationToken(user.id);

    res
      .status(200)
      .json({ message: "User retrieved successfully", token: plaintext });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserById(req: Request, res: Response) {
  const userId = req.user!.id;
  try {
    validateId(userId);

    if (!req.params.userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const user = await db.Models.Users.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to get user" });
    }
  }
}

async function updateUser(req: Request, res: Response) {
  const userId = req.user!.id;

  const { email, firstName, lastName, password } = req.body;
  try {
    validateId(userId);

    if (email) validateEmail(email);

    if (password) validatePassword(password);

    if (firstName || lastName) {
      validateName(email!, firstName!);
    }

    const updatedUser = db.Models.Users.updateUser(
      userId,
      email,
      firstName,
      lastName,
      password
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to update user" });
    }
  }
}
async function deleteUser(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    validateId(userId);
    const deletedUserId = db.Models.Users.deleteUser(userId);
    res.status(200).json(deletedUserId);
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
}

export { userRouter };

// https://www.usebruno.com/
// MVC model view controller
