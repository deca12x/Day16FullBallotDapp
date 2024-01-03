import { FormEvent, useState } from "react";

export const Propose = (params: { contractAddress: string }) => {
  interface Proposal {
    target: string;
  }
  interface ProposeData {
    deployTxReceipt: Proposal[];
  }

  const [data, setData] = useState<ProposeData | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const proposals = userInput.split(",").map(item => item.trim());
    const body = { contractAddress: params.contractAddress, proposals: proposals };

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
  };

  if (isLoading) return <p>Creating proposal...</p>;

  if (!data)
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="choco, mint, berry"
        />
        <button type="submit">Create Proposal</button>
      </form>
    );

  if (!data) return <p>Operation Failed</p>;
  console.log(data);
  const proposalAddress = data.deployTxReceipt[0].target;
  return (
    <div>
      <p>{proposalAddress}</p>
      <p>Proposal Options: {userInput}</p>
    </div>
  );
};
