import express from "express";
import cors from "cors";
import { encryptData, decryptData } from "./encryption";

const PORT = 8080;
const app = express();

const database = { data: "Hello World" };
const backupHistory: string[] = [database.data];

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  const encryptedData = encryptData(database.data);
  res.json({ data: encryptedData });
});

app.post("/", (req, res) => {
  const decryptedData = decryptData(req.body.data);
  if (decryptedData) {
    backupHistory.unshift(decryptedData);
    database.data = decryptedData;
    res.json({ data: database.data });
  } else {
    res.status(401).json({ error: "Invalid Data" });
  }
});

// Simulate a hacker tampering with the database data directly
app.get("/tamper", (req, res) => {
  database.data = "hacked";
  res.json({ data: database.data });
});

// Get all backup history
app.get("/recover", (req, res) => {
  return res.json({ data: backupHistory });
})

// Recover data from the last backup by id
app.get("/recover/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = backupHistory[id];
  if (data) {
    database.data = data;
    res.json({ data: database.data });
  } else {
    res.status(404).json({ error: "Backup Data Not Found" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
