// const crypto = require('crypto');
// const fs = require('fs');

// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, });

// fs.writeFileSync('privateKey.pem', privateKey.export({type: 'pkcs1', format:'pem'}));
// fs.writeFileSync('publicKey.pem', publicKey.export({type: 'pkcs1', format:'pem'}));

const crypto = require('crypto');
const fs = require('fs');

// Generate RSA key pair (private and public keys)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,  // Key length (2048-bit RSA is recommended for most purposes)
  publicKeyEncoding: {
    type: 'spki',        // Standard Public Key Infrastructure format
    format: 'pem'        // PEM encoded (Base64 with header/footer)
  },
  privateKeyEncoding: {
    type: 'pkcs8',       // PKCS#8 format for private key
    format: 'pem'        // PEM encoded
  }
});

// Save private key to file
fs.writeFileSync('privateKey.pem', privateKey);

// Save public key to file
fs.writeFileSync('publicKey.pem', publicKey);

console.log("RSA key pair generated and saved.");