import { useState } from "react";

export const Propose = (params: { contractAddress: string }) => {
  interface ProposeData {
    deployTxReceipt: string;
  }

  const [data, setData] = useState<ProposeData | null>(null);
  const [isLoading, setLoading] = useState(false);

  const proposals = ["a", "b", "c"];
  const proposalsForOutput = proposals.join(", ");
  const body = [{ contractAddress: params.contractAddress }, { proposals: proposals }];

  if (isLoading) return <p>Creating proposal...</p>;

  if (!data)
    return (
      <button
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/deployballot-proposaldata", {
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
        Give some Options and Create a Proposal
      </button>
    );

  if (!data) return <p>Operation Failed</p>;
  return (
    <div>
      <p>Proposal Options: {proposalsForOutput}</p>
    </div>
  );
};
