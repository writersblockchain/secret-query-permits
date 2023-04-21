import "./App.css";
import { useState } from "react";
import { SecretNetworkClient, Wallet } from "secretjs";

function App() {
  const [signature, setSignature] = useState(null);
  const permitName = "view my card";
  const chainId = "pulsar-2";
  const myAddress = "secret1j7n3xx4sfgjea4unghd78qvnvxdz49cxmrkqlj";
  const allowedTokens = "secret13q57es44szumqy43d6rfwl9gc2d4xsa82yzlrh";
  const contractCodeHash =
    "e2c24d4ebfaa785b033a09e679bb468814018fc4d08a6b1d024da4181f7fe054";
  const contractAddress = "secret13q57es44szumqy43d6rfwl9gc2d4xsa82yzlrh";

  const wallet = new Wallet(
    "shed clerk spray velvet flower tide cherry idea public solar prize tackle"
  );

  const secretjs = new SecretNetworkClient({
    chainId: "pulsar-2",
    url: "https://api.pulsar.scrttestnet.com",
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
              allowed_tokens: [allowedTokens],
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
              allowed_tokens: [allowedTokens],
              chain_id: "pulsar-2",
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
