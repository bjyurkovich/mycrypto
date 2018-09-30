const apiV1 = require("express").Router();
const routes = require("./routes");

apiV1.get("/aes-test/:text/:key", routes.aesTest);
apiV1.post("/aes-test", routes.aesTest);
apiV1.get(
  "/rsa-create-certificates/:id/:passphrase/:keySize",
  routes.rsaCreateCertificate
);
apiV1.post("/rsa-create-certificates", routes.rsaCreateCertificate);
apiV1.get("/rsa-get-public-certificate/:id", routes.getPublicKeyTest);
apiV1.get("/rsa-get-private-certificate/:id", routes.getPrivateKeyTest);
apiV1.get("/rsa-encrypt/:id/:text", routes.rsaEncrypt);
apiV1.post("/rsa-encrypt/:id", routes.rsaEncrypt);
module.exports = apiV1;
