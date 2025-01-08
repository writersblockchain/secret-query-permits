import "./App.css";
import { useState } from "react";
import { SecretNetworkClient, Wallet } from "secretjs";

function App() {
  const [signature, setSignature] = useState(null);
  const permitName = "view my card";
  const chainId = "pulsar-3";
  const myAddress = "secret1verdmwf2e0d930vulxru5fg3lm9y8r3xg5u7l6";

  // const allowedTokens = "secret1plx46wr96v0sxgg9vyz2uw0jjnycc0euqzut2k";
  const contractCodeHash =
    "370e1a4c6f11a0e35077bc318f3a7d712a0b5aa731a533e3540801ffffc27faa";
  const contractAddress = "secret1plx46wr96v0sxgg9vyz2uw0jjnycc0euqzut2k";

  const wallet = new Wallet(
    "shed clerk spray velvet flower tide cherry idea public solar prize tackle"
  );

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});


  let create_viewing_permit = async () => {
    const { signature } = await window.keplr.signAmino(
      chainId,
      myAddress,
      {
        chain_id: chainId,
        account_number: "0", // Must be 0
        sequence: "0", // Must be 0
        fee: {
          amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
          gas: "1", // Must be 1
        },
        msgs: [
          {
            type: "query_permit", // Must be "query_permit"
            value: {
              permit_name: permitName,
              allowed_tokens: [contractAddress],
              permissions: [],
            },
          },
        ],
        memo: "", // Must be empty
      },
      {
        preferNoSetFee: true, // Fee must be 0, so hide it from the user
        preferNoSetMemo: true, // Memo must be empty, so hide it from the user
      }
    );
    setSignature(signature);
    console.log(signature);
  };

  let queryCard = async () => {
    let business_card_query_tx = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      code_hash: contractCodeHash,
      query: {
        get_card: {
          wallet: "secret1j7n3xx4sfgjea4unghd78qvnvxdz49cxmrkqlj",
          index: 0,
          permit: {
            params: {
              permit_name: permitName,
              allowed_tokens: [contractAddress],
              chain_id: "pulsar-3",
              permissions: [],
            },
            signature: signature,
          },
        },
      },
    });
    console.log(business_card_query_tx);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={create_viewing_permit}>Create Permit</button>
          <button onClick={queryCard}>Query Card</button>
        </div>
      </header>
    </div>
  );
}

export default App;
