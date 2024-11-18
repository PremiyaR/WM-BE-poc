const Patient = require("../model/Patient.js");
const express = require("express");
const router = express.Router();
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
     const response = patients.map((patient) => {

      // Decrypt AES Key using private key
      const decryptedAESKey = crypto.privateDecrypt(
            privateKey,
        Buffer.from(patient.encryptedKey, 'base64') 
    ).toString();

      return{
        encryptedData: patient.encryptedData,
        decryptedAESKey,
      }
    });
   
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

module.exports = router;
