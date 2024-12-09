import express from "express";
import { authenticate } from "./middleware/auth.js";

//create express app
const app = express();
const PORT = process.env.PORT ?? 3000;

//Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticate);

app.get("/hello", (req, res) => {
  console.log(req.user, "This is the user");
  // res.json({ serverMessage: "Hello world!" });
});

import { rootRouter } from "./controllers/root.js";
import { userRouter } from "./controllers/user-controller.js";
import { snippetRouter } from "./controllers/snippet-controller.js";
import { authenticate } from "./middleware/auth.js";

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/snippets", snippetRouter);

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
