# adyen-proxy-devstage

Proxy Adyen notifications to dev-stage for development purposes.

## Usage

1. Open your router's port to the Internet and foward it to your local machine.
2. Set up a DNS record for your router's public IP address.
3. Obtain a _valid_ certificate (the _full_ chain is required: you can't just self-sign it) for your domain.  
   Set it up so that:
   - `cert.pem` is the certificate and the chain.
   - `chain.pem` is the CA chain (w/o the actual certificate itself).
   - `key.pem` is the private key.
4. `npm install`
5. `./index.ts` (requires `ts-node`)
6. Set up an Adyen Webhook that sends notifications to `https://your.domain:port`.
