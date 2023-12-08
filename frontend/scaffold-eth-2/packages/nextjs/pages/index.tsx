import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Mint } from "~~/components/Mint";

const Home: NextPage = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Fullstack Ballot dApp</span>
            <span className="block text-2xl mb-2">@deca12x Dec 2023</span>
          </h1>
        </div>

        {isDisconnected && <div>Wallet disconnected. Connect wallet to continue</div>}

        {isConnecting && <div>Connecting wallet...</div>}

        {address && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row my-12">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <p>My wallet address is {address}</p>
                {address && <Mint address={address as `0x${string}`} />}
              </div>
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <p>There</p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row my-12">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <p>Little</p>
              </div>
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <p>Friend</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
