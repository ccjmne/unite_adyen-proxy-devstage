# adyen-proxy-devstage

Proxy Adyen notifications to dev-stage for development purposes.

## Usage

1. Open a port on your router the Internet and foward it to your local machine.  
   This port shall thereafter be referred to as `port`.
2. Set up a DNS record for your router's public IP address.  
   This record shall thereafter be referred to as `your.domain`.
3. Set up an Adyen Webhook that sends notifications to `https://your.domain:port`.
4. Obtain a **valid** certificate (the **full** chain is required: you can't just self-sign it) for your domain.  
   Set it up so that:
   - `cert.pem` is the certificate and the chain.
   - `chain.pem` is the CA chain (w/o the actual certificate itself).
   - `key.pem` is the private key.
5. Install dependencies: `npm install`.
6. Start up the proxy: `./index.ts` (requires `ts-node`).
