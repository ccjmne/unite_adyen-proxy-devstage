# adyen-proxy-devstage

Proxy Adyen notifications to dev-stage for development purposes.

## Set-up and usage

1. Open a port on your router the Internet and foward it to your local machine.
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
6. Start up the proxy: `./index.ts` (requires `ts-node`).

   > The proxy will listen on `localhost:3000` and forward requests to `https://dev-stage.mercateo.lan/incoming/adyen/urlnotify/gb`.
   >
   > These defaults can be changed by passing the `port` and `destination` arguments as follows:  
   >  `./index.ts <port> <destination>`
