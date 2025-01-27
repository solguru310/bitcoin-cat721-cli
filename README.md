# bitcoin-cat-721-cli
#Bitcoin #Fractal #CAT721 #Protocol CLI: This is a reference implementation of the Covenant Attested Token (CAT721) protocol.


## Clone
```bash
git clone https://github.com/solguru310/bitcoin-cat721-cli
cd bitcoin-cat721-cli
```

`cli` requires a synced [tracker](https://github.com/CATProtocol/cat-token-box/blob/main/packages/tracker/README.md), run it from the beginning or follow this [guide](https://github.com/CATProtocol/cat-token-box/releases/tag/cat721) to upgrade.

## Installation

```bash
yarn install
```

## Build

```sh
yarn build
```

## Usage

1. Copy [config.example.json](config.example.json) as `config.json`. Update `config.json` with your own configuration.

All commands use the `config.json` in the current working directory by default. You can also specify a customized configuration file with `--config=your.json`.

2. Create a wallet

```bash
yarn cli wallet create
```

You should see an output similar to:

```
? What is the mnemonic value of your account? (default: generate a new mnemonic) ********
Your wallet mnemonic is:  ********
exporting address to the RPC node ... 
successfully.
```

3. Show address

```bash
yarn cli wallet address
```

You should see an output similar to:

```
Your address is bc1plf*******************
```

4. Fund your address

Deposit some satoshis to your address.


5. Show nfts

```bash
yarn cli wallet balances -i c1a1a777a52f76******************************************f574f82_0
```

You should see an output similar to:

```
┌────────────────────────────────────────────────────────────────────────┬────────┐
│ nft                                                                    │ symbol │
┼────────────────────────────────────────────────────────────────────────┼────────┤
│ 'c1a1a777a52f76*******************************************f574f82_0:1' │ 'LCAT' │
│ 'c1a1a777a52f76*******************************************f574f82_0:0' │ 'LCAT' │
┴────────────────────────────────────────────────────────────────────────┴────────┘
```

6. Deploy a collection

- deploy with a metadata json:


```bash
yarn cli deploy --metadata=metadata.json
```

`metadata.json`:

- closed mint:


```json
{
    "name": "LCAT",
    "symbol": "LCAT",
    "description": "this is a cat721 nft collection",
    "max": "10"
}
```

- open mint:


```json
{
    "name": "LCAT",
    "symbol": "LCAT",
    "description": "this is a cat721 nft collection",
    "premine": "0",
    "max": "10"
}
```

- deploy with command line options:


- closed mint
   
```bash
yarn cli deploy --name=LCAT --symbol=LCAT --max=10
```

- parallel closed mint:
    
```bash
yarn cli deploy --name=LCAT --symbol=LCAT --max=10 --parallel
```

- open mint
   

```bash
yarn cli deploy --name=LCAT --symbol=LCAT --max=10 --premine=0 --openMint
```

You should see an output similar to:

```
Nft collection LCAT has been deployed.
CollectionId: c1a1a777a52f76*****************************************f574f82_0
Genesis txid: c1a1a777a52f76*****************************************19f574f82
Reveal txid: d7871b55f885*******************************************db5b51265
```


1. Mint nft

```bash
yarn cli mint -i [collectionId]
```
You should see an output similar to:

```
Minting LCAT NFT in txid: ef9d98eeae21***************************************6f95f5cb ...
```

1. Send nft

```bash
yarn cli send -i [collectionId] -l [localId] [receiver]
```
You should see an output similar to:

```
Sending LCAT:0 nft  to bc1ppresf**********************************************rqvm9k07 
in txid: 277eb0198b*********************************************8c24ef52
```

-----------------

### FeeRate

`deploy`, `mint`, and `send` commands can all specify a fee rate via option `--fee-rate`.
