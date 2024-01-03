import React, { useState } from "react";
import axios from "axios";

interface Proposal {
  target: string;
}

interface ProposeData {
  deployTxReceipt: Proposal[];
}

interface ProposeProps {
  contractAddress: string;
}

export const Propose: React.FC<ProposeProps> = ({ contractAddress }) => {
  const [data, setData] = useState<ProposeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const proposals = userInput.split(",").map(item => item.trim());
    const response = await axios.post("http://localhost:3001/deployballot-proposaldata", {
      contractAddress,
      proposals,
    });
    const proposeData: ProposeData = await response.data;
    setData(proposeData);
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Proposals:
          <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {data && (
        <div>
          <h2>Deploy Transaction Receipt:</h2>
          {data.deployTxReceipt.map((proposal, index) => (
            <p key={index}>{proposal.target}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Propose;
