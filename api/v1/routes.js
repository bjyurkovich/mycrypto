const wrap = require("../../lib/handler");
const openpgp = require("openpgp"); // use as CommonJS, AMD, ES6 module or via window.openpgp

const crypto = require("crypto"),
  algorithm = "aes-256-ctr";

let testKeys = {};

openpgp.initWorker({ path: "openpgp.worker.js" }); // set the relative web worker path

const aesEncrypt = (text, key) => {
  var cipher = crypto.createCipher(algorithm, key);
  var crypted = cipher.update(text, "utf8", "base64");
  crypted += cipher.final("base64");
  return crypted;
};

exports.aesTest = wrap(async (req, res, next) => {
  req.params.text = req.params.text ? req.params.text : req.body.text;
  req.params.key = req.params.key ? req.params.key : req.body.key;

  let encrypted = aesEncrypt(req.params.text, req.params.key);
  res.json({
    encrypted,
    algorithm,
    encoding: "utf8",
    base: 64,
    command: `echo ${encrypted} | openssl enc -base64 -d -${algorithm} -nosalt -pass pass:${
      req.params.key
    } && echo`
  });
});

exports.rsaCreateCertificate = wrap(async (req, res, next) => {
  req.params.id = req.params.id ? req.params.id : req.body.id;
  req.params.keySize = req.params.keySize
    ? req.params.keySize
    : req.body.keySize;
  req.params.passphrase = req.params.passphrase
    ? req.params.passphrase
    : req.body.passphrase;

  var options = {
    userIds: [{ name: req.params.id }], // multiple user IDs
    numBits: req.params.keySize, // RSA key size
    passphrase: req.params.passphrase, // protects the private key,
    armored: true
  };

  let key = await openpgp.generateKey(options);
  let privateKey = key.privateKeyArmored;
  let publicKey = key.publicKeyArmored;
  let signature = key.revocationSignature;

  let pko = (await openpgp.key.readArmored(privateKey)).keys[0];
  await pko.decrypt(req.params.passphrase);

  let o = {
    message: openpgp.cleartext.fromText(req.params.id), // CleartextMessage or Message object
    privateKeys: [pko], // for signing
    detached: true
  };

  let signed = await openpgp.sign(o);

  testKeys[req.params.id] = {
    privateKey,
    publicKey,
    signature,
    ...req.params,
    command: `export URL=http://localhost:9000 && curl $URL/v1/rsa-get-private-certificate/${
      req.params.id
    } > priv.key && gpg --import priv.key && curl $URL/v1/rsa-encrypt/${
      req.params.id
    }/TEXT_TO_ENCRYPT > message.enc && gpg --output out.txt --decrypt message.enc && more out.txt`,
    signed
  };

  res.json(testKeys[req.params.id]);
});

exports.getPublicKeyTest = wrap(async (req, res, next) => {
  res.set("Content-Type", "text/plain");
  res.send(testKeys[req.params.id].publicKey);
});

exports.getPrivateKeyTest = wrap(async (req, res, next) => {
  res.set("Content-Type", "text/plain");
  res.send(testKeys[req.params.id].privateKey);
});

exports.rsaEncrypt = wrap(async (req, res, next) => {
  req.params.text = req.params.text ? req.params.text : req.body.text;

  const privKeyObj = (await openpgp.key.readArmored(
    testKeys[req.params.id].privateKey
  )).keys[0];
  await privKeyObj.decrypt(testKeys[req.params.id].passphrase);

  const options = {
    message: openpgp.message.fromText(req.params.text), // input as Message object
    publicKeys: (await openpgp.key.readArmored(
      testKeys[req.params.id].publicKey
    )).keys, // for encryption
    privateKeys: [privKeyObj] // for signing (optional)
  };
  let ciphertext = await openpgp.encrypt(options);
  let encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'

  res.set("Content-Type", "text/plain");
  res.send(encrypted);
});
