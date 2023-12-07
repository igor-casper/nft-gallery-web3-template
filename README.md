# Casper NFT Redeem App (CEP78)
This project is an updated version of the [CEP47 Redeem App](https://github.com/casper-ecosystem/nft-gallery-web3-template), designed to work with the new [CEP78 standard](https://github.com/casper-ecosystem/cep-78-enhanced-nft).

## Middleware
Middleware serves as a bridge between the frontend and the Casper network, functioning as a proxy. It incorporates a MongoDB persistence layer for caching data, reducing the need for frequent network queries during user visits. The middleware monitors contract-related events, specifically tracking changes in NFT ownership.

**Note:** the current middleware version operates under the assumption that all NFTs are minted in advance. As a result, it simply transfers ownership from one account (accessible to the middleware) to another when necessary.


## Frontend
The frontend enables users to browse and redeem transferred NFTs using email/code pairs. Additionally, it interfaces with [Casper Wallet](https://www.casperwallet.io) and [Casper Dash](https://casperdash.io) to validate proper generation of user private/public keys.

### Showcase video
<video controls src="https://github.com/igor-casper/nft-gallery-web3-template/assets/152597353/480f3930-fae2-4f4c-8cbe-0a0297c8278a"></video>

## Build instructions
1. Install a CEP78 contract as described in the [guide](https://github.com/casper-ecosystem/cep-78-enhanced-nft#building-the-contract).
2. Mint the series of NFTs using following metadata and using [casper-cep78-js-client](https://github.com/casper-ecosystem/cep-78-enhanced-nft/tree/dev/client-js). The schema is defined at `middleware/src/schemas/nft.schema.ts` and can be adjusted according to your needs.
```
  description: string;
  external_url: string;
  image: string;
  name: string;
  batch: string;
```

3. Configure the following variables `.env` in an app:
```
# DEV SETUP
MIDDLEWARE_PORT=4000
MIDDLEWARE_URL=http://0.0.0.0:4000/app
MONGO_URL=mongodb:27017

MONGO_DB_NAME=tigers
MONGO_USERNAME=tiger_user
MONGO_PASSWORD=tiger_pass

# CHAIN SETUP
CHAIN_RPC_URL= # RPC-SCHEMA URL
CHAIN_NET_NAME= # NETWORK NAME
CHAIN_EE_URL= # MAIN EVENT STREAM URL
CHAIN_CONTRACT_ADDR= # CONTRACT HASH
CHAIN_CONTRACT_PACKAGE_ADDR= # CONTRACT PACKAGE HASH
CHAIN_PRIV_KEY_VARIANT= # TWO VALID OPTIONS: ED25519 or SECP256K1
CHAIN_PRIV_KEY_BASE64= # ONE LINE PRIVATE KEY BASE64 REPRESENTATION (for example from `casper-client-rs`) eg. `MC4CAQAwBQYDK2VwBCIEIOPkC3OAuMmsclduN3d/i9cYxP2sNzl1/FWWFhJxeLS5`
TOTAL_NFTS_NUM= # TOTAL NUMBER OF MINTED NFTs
```

4. Build the up running `docker compose -f docker-compose.yml -f docker-compose.dev.yml build`
5. Launch the app with `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`, initiating the retrieval and storage of minted NFT data from the specified contract into a database.
6. Access the API at `localhost:4000/app` and the frontend at `localhost:3000`.
7. To use the app, insert submissions into the database. Use an example submission with 100 tickets located in the `example/tickets.json` directory. It's recommended to perform this manually using the MONGODB CLI.

## Feedback and contribution
Feel free to contribute by utilizing the issues tab or forking the repo and creating PRs for approval. We intend to make this project driven by the community's requests, and any open source contributions are welcome.

## TODO
- Finish the CEP42 → CEP78 migration
- App should be able to mint new nfts