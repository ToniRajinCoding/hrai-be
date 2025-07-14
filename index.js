const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// 🔒 Firebase Admin Initialization
admin.initializeApp({
  credential: admin.credential.cert(require("/etc/secrets/firebase-key.json")),
  projectId: "nyoba2-462111",
});

const db = admin.firestore();
db.settings({ databaseId: "demo-database" });

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 Enable CORS for all origins (wildcard '*')
app.use(cors());

// 📄 GET all applicants
app.get("/applicants", async (req, res) => {
  try {
    const snapshot = await db.collection("job-applicant").get();
    const applicants = [];

    snapshot.forEach((doc) => {
      applicants.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔍 GET applicant by ID
app.get("/applicants/:id", async (req, res) => {
  const docId = req.params.id;

  try {
    const doc = await db.collection("job-applicant").doc(docId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching applicant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
