import { Router } from "express";

const userRouter = Router();

userRouter.post("/", async (req, res) => {
  console.log("post request", req.body);
  res.end();
});

export { userRouter };
