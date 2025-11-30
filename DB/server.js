// server.js
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(results);
  });
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
