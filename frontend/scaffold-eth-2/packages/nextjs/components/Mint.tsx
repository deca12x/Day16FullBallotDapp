import { useState } from "react";

export const Mint = (params: { address: string }) => {
  interface MintData {
    mintTxReceipt: string;
    delegateTxReceipt: string;
    balance: number;
    votingPower: number;
  }
  const [data, setData] = useState<MintData | null>(null);
  const [isLoading, setLoading] = useState(false);

  const body = { walletAddress: params.address };

  if (isLoading) return <p>Minting voting tokens...</p>;

  if (!data)
    return (
      <button
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/mint-delegate-balance-votingpower", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
            .then(res => res.json())
            .then(data => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Mint Voting Tokens
      </button>
    );

  if (!data) return <p>Operation Failed</p>;
  return (
    <div>
      <p>Mint Transaction Receipt: {data.mintTxReceipt}</p>
      <p>Delegate Transaction Receipt: {data.delegateTxReceipt}</p>
      <p>Balance: {data.balance}</p>
      <p>Voting Power: {data.votingPower}</p>
    </div>
  );
};
