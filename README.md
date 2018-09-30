# mycrypto

# RSA

`POST http://localhost:9900/v1/rsa-create-certificates`

```json
{
  "id": "id",
  "passphrase": "passphrase",
  "keySize": 1024
}
```

`POST http://localhost:9900/v1/rsa-encrypt/id`

```json
{
  "text": "this is some text that is encryptable"
}
```

# AES

`http://localhost:9900/v1/aes-test/`

```json
{
  "text": "test",
  "key": "mykey"
}
```
