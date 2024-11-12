import { Router } from "express";

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  res.json({ status: "Available" });
});

export { rootRouter };
