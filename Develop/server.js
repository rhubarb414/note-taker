const fs = require("fs");
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static("public"));

// GET request to go to Notes screen
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// POST request to save note
app.post("/notes", (req, res) => {
  res.body;
});

// GET request to get note database
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

// Display PORT to terminal
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
