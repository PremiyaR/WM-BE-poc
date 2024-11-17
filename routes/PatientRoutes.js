const Patient = require("../model/Patient.js");
const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const fs = require("fs");
const crypto = require("crypto");

const privateKey = fs.readFileSync("privateKey.pem", "utf8");

// POST CALL
router.post("/", async (req, res) => {
  try {
    const { encryptedData, encryptedKey } = req.body;
   
    // Save patient data to database
    const patient = new Patient({ encryptedData, encryptedKey });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error("Error in post call:", err);
    res.status(400).json({ error: err.message });
  }
});


// GET CALL
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();

    if (!patients || patients.length === 0) {
      return res.status(404).json({ error: "No patients found" });
    }

     // Send only encrypted data and keys
     const response = patients.map((patient) => ({
      encryptedData: patient.encryptedData,
      encryptedKey: patient.encryptedKey,
    }));
   
    res.status(200).json(response);
  } catch (err) {
    console.error("Error in get call:", err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to retrieve public key
router.get("/public-key", (req, res) => {
  const publicKey = fs.readFileSync("publicKey.pem", "utf-8");
  res.status(200).send(publicKey);
});

router.get("/private-key", (req, res) => {
  try {
    // Ensure the request is authenticated for security purposes

    const privateKey = fs.readFileSync("privateKey.pem", "utf-8");
    res.status(200).send( privateKey );
  } catch (error) {
    console.error("Error fetching private key:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
