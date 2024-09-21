import express from "express";

const app = express();

app.get("/hello", (req, res) => {
  res.json({ serverMessage: "Hello world" });
});

app.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
