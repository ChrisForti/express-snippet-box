import express from "express";
import { pool } from "./db/db.js";

//create express app
const app = express();
const PORT = process.env.PORT ?? 3000;

//Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/hello", (req, res) => {
  res.json({ serverMessage: "Hello world!" });
});

import { rootRouter } from "./routes/root.js";
import { userRouter } from "./routes/user.js";

app.use("/", rootRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
