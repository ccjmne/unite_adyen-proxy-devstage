# adyen-proxy-devstage

Proxy Adyen notifications to dev-stage for development purposes.

## Setup and usage

1. Open to the Internet a port on your router and forward it to your local machine.
   > This port shall thereafter be referred to as `port`.
2. Set up a DNS record for your router's public IP address.
   > This record shall thereafter be referred to as `your.domain`.
3. Set up an Adyen Webhook that sends notifications to `https://your.domain:port`.
4. Obtain a **valid** certificate for your domain.
   > The **full** chain is required; you cannot just self-sign it:  
   > Adyen will reject certificates that aren't delivered by a competent authority, even for tests.
   >
   > Set it up so that:
   >
   > - `cert.pem` is the certificate and the chain.
   > - `chain.pem` is the CA chain (w/o the actual certificate itself).
   > - `key.pem` is the private key.
5. Install dependencies: `npm install`.
6. Start up the proxy: `./index.ts`.
   > - It supposes `ts-node` to be installed globally: `npm install --global ts-node`.
   > - The proxy will listen on `localhost:3000` and forward requests to `https://dev-stage.mercateo.lan/incoming/adyen/urlnotify/gb/`.
   >
   >   These defaults can be changed by passing the `port` and `destination` arguments as follows:  
   >   `./index.ts <port> <destination>`
   >
   > - In your shell, the output will be coloured by default.
   >
   >   To obtain a diff-syntax–powered ouput instead, set the `OUTPUT` env to `diff`, as follows:  
   >   `OUTPUT=diff ./index.ts`

## Example

Start the proxy:

```shell
OUTPUT=diff ./index.ts 8443 https://dev-stage.mercateo.lan/incoming/adyen/urlnotify/gb/
```

Emulate a notification:

```shell
curl https://your.domain:8443 \
  --header 'Content-Type: application/json' \
  --data '{ "success": true, "reference": "123456", "amount": { "currency": "GBP", "value": 2024 } }'
```

Output of the `curl` request:

```json
{
  "RESPONSE_DESCRIPTION": "DOCUMENT_RECEIVED_SUCCESSFULLY",
  "RESPONSE_CODE": "SUCCESS",
  "LAUFZETTEL_ID": "1919191",
  "notification": "[accepted]"
}
```

Output of the proxy server:

```diff
@@ [listen] Proxy listening on https://localhost:8443                                             @@
#    [info] Forwarding to https://dev-stage.mercateo.lan/incoming/adyen/urlnotify/gb/
+      [in] {
+      [in]   "success": true,
+      [in]   "reference": "123456",
+      [in]   "amount": {
+      [in]     "currency": "GBP",
+      [in]     "value": 2024
+      [in]   }
+      [in] }
-     [out] {
-     [out]   "RESPONSE_DESCRIPTION": "DOCUMENT_RECEIVED_SUCCESSFULLY",
-     [out]   "RESPONSE_CODE": "SUCCESS",
-     [out]   "LAUFZETTEL_ID": "1919191",
-     [out]   "notification": "[accepted]"
-     [out] }
```
