const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
   encryptedData: String,
   encryptedKey: String,
})

module.exports= mongoose.model('Patient',patientSchema);