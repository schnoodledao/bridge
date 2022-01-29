var CryptoJS = require("crypto-js");
 
// Encrypt
var ciphertext = CryptoJS.AES.encrypt('private_key', 'encryption_key').toString();
 
console.log(ciphertext)