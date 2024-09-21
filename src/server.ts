import express from "express";

const app = express();

const PORT = process.env.PORT ?? 3000;

app.get("/hello", (req, res) => {
  res.json({ serverMessage: "Hello world!" });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
