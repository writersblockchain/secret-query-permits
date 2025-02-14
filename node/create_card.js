import { SecretNetworkClient, Wallet} from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.WALLET);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://pulsar.lcd.secretnodes.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

let contractAddress = "secret1plx46wr96v0sxgg9vyz2uw0jjnycc0euqzut2k"
let contractCodeHash = "370e1a4c6f11a0e35077bc318f3a7d712a0b5aa731a533e3540801ffffc27faa"

let createCard = async () => {
    const card_creation_tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contractAddress,
        msg: {
          create: {
            card: {
              name: "sean",
              email: "sean@gmail.com",
              whitelist: [
                "secret1verdmwf2e0d930vulxru5fg3lm9y8r3xg5u7l6",
              ],
            },
            index: 0,
          },
        },
        code_hash: contractCodeHash,
      },
      { gasLimit: 100_000 }
    );
  
    console.log(card_creation_tx);
  };
  createCard();
