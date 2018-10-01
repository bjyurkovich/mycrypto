# mycrypto

Swagger: [https://bjcrypto.herokuapp.com/](https://bjcrypto.herokuapp.com/)

# RSA

`POST https://bjcrypto.herokuapp.com/v1/rsa-create-certificates`

```json
{
  "id": "id",
  "passphrase": "passphrase",
  "keySize": 1024
}
```

`POST https://bjcrypto.herokuapp.com/v1/rsa-encrypt/id`

```json
{
  "text": "this is some text that is encryptable"
}
```

# AES

`https://bjcrypto.herokuapp.com/v1/aes-test/`

```json
{
  "text": "test",
  "key": "mykey"
}
```
