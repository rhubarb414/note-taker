const fs = require("fs");
const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET request to go to Notes screen
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET request to get note database
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

// POST request to save note
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to save note`);

  // Destructuring assignment for note title and text in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // create newNote with properties from the req.body
    const newNote = {
      title,
      text,
      id: uuidv4(), // add uuid to each new note
    };

    // Parse current db into an array so newNote can be pushed to it
    // and then save the new db.
    fs.readFile(`./db/db.json`, "utf8", (err, data) => {
      if (err) {
        console.error("read error: " + err);
      } else {
        const notesArr = JSON.parse(data);
        notesArr.push(newNote);
        const notesString = JSON.stringify(notesArr, null, 4);
        fs.writeFile(`./db/db.json`, notesString, (err) =>
          err
            ? console.error(err)
            : console.log(
                `Note titled '${newNote.title}' has been written to JSON file`
              )
        );
      }
    });
    res.status(200).json("Success!");
  } else {
    res.status(500).json("Error saving note");
  }
});

// GET request for wildcard to return index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// DELETE request for destroying invididual notes
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(`./db/db.json`, "utf8", (err, data) => {
    if (err) {
      console.error("read error: " + err);
      res.status(500).json("Error deleting note");
    } else {
      const notesArr = JSON.parse(data);
      for (let i = 0; i < notesArr.length; i++) {
        if (notesArr[i].id === id) {
          console.log("removing note titled: " + notesArr[i].title);
          notesArr.splice(i, 1);
        }
      }
      const notesString = JSON.stringify(notesArr, null, 4);
      fs.writeFile(`./db/db.json`, notesString, (err) =>
        err ? console.error(err) : console.log(`DB updated`)
      );
      res.status(200).json("Success!");
    }
  });
});

// Display PORT to terminal
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
