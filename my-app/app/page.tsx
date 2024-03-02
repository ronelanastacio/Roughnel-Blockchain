"use client";
import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { getContract } from "../config";
import Image from "next/image";

export default function Home() {
  const [walletKey, setWalletKey] = useState("");
  const [mintingAmount, setMintingAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [stakingAmount, setStakingAmount] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState<number>(0);
  const [mintedAmount, setMintedAmount] = useState<number>(0);

  const [mintSubmitted, setMintSubmitted] = useState(false);
  const [stakeSubmitted, setStakeSubmitted] = useState(false);
  const [withdrawSubmitted, setWithdrawSubmitted] = useState(false);

  const mintCoin = async () => {
    if (mintingAmount <= 0) {
      alert("Please enter a valid amount to mint.");
      return;
    }

    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const tx = await contract.mint(signer, Math.floor(mintingAmount)); // Use Math.floor() to ensure the amount is an integer
      await tx.wait();
      setMintSubmitted(true);
      checkBalance();
      setMintedAmount(mintedAmount + mintingAmount); // Update minted amount
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const mintAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintingAmount(Number(inputValue));
    } else {
      setMintingAmount(0);
    }
  };

  const stakeCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const tx = await contract.stake(Math.floor(stakingAmount)); // Use Math.floor() to ensure the amount is an integer
      await tx.wait();
      setStakeSubmitted(true);
      checkBalance();
      setStakedAmount(stakedAmount + stakingAmount); // Update staked amount
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Staking failed: ${decodedError?.args}`);
    }
  };

  const stakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setStakingAmount(Number(inputValue));
    } else {
      setStakingAmount(0);
    }
  };

  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const tx = await contract.withdraw();
      await tx.wait();
      setWithdrawSubmitted(true);
      checkBalance();
      setWithdrawnAmount(withdrawnAmount + withdrawAmount); // Update withdrawn amount
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Withdrawal failed: ${decodedError?.args}`);
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window as any;

    try {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: [
              "https://sepolia-rollup.arbitrum.io/rpc",
              "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
            ],
            chainId: "0x66eee",
            chainName: "Arbitrum Sepolia",
          },
        ],
      });

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletKey(accounts[0]);

      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x66eee",
          },
        ],
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet. Please make sure you have an Ethereum-compatible wallet installed and connected.");
    }
  };

  const checkBalance = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const userBalance = await contract.balanceOf(accounts[0]);
      setBalance(userBalance.toNumber());
    } catch (error) {
      console.error("Error checking balance:", error);
    }
  };

  useEffect(() => {
    if (walletKey) {
      checkBalance();
    }
  }, [walletKey, mintSubmitted, stakeSubmitted, withdrawSubmitted]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100" style={{ backgroundImage: "url('https://img.freepik.com/free-vector/gradient-zoom-effect-background_23-2149717745.jpg?w=740&t=st=1709367679~exp=1709368279~hmac=76eb6d373df75ffb2df08ff8659ed5807b40df6c0faa10c553adfc410c684885')", backgroundPosition: "center" }}>
      <div className="max-w-max bg-gray-300 rounded-lg text-center p-4">
        <h1 className="text-3xl font-bold text-black"> Roughnel Minting </h1>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <button
          onClick={() => {
            connectWallet();
          }}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded focus:outline-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 mt-4"
        >
          Connect Wallet
        </button>
      </div>

      <div className="flex mb-8">
        <div className="w-1/2 pr-1">
          <div className="bg-gray-300 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Minting</h2>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={mintingAmount}
              onChange={(e) => setMintingAmount(Number(e.target.value))}
              style={{ width: "80%" }}
            />
            <p className="text-xl mt-4">Amount: {mintingAmount}</p>
            <button
              onClick={() => {
                mintCoin();
              }}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded focus:outline-none hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-xl"
            >
              Mint Tokens
            </button>
            {mintSubmitted && <p className="text-green-500 mt-2">Minting successful! Total Minted: {mintedAmount}</p>}
          </div>
        </div>
        <div className="w-1/2 pl-1">
          <div className="bg-gray-300 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
            <h2 className="text-xl font-semibold mb-4 text-center"> Staking </h2>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={stakingAmount}
              onChange={(e) => setStakingAmount(Number(e.target.value))}
              style={{ width: "80%" }}
            />
            <p className="text-xl mt-4">Amount: {stakingAmount}</p>
            <button
              onClick={() => {
                stakeCoin();
              }}
              className="bg-orange-500 text-white font-bold py-3 px-8 rounded focus:outline-none hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 text-xl"
            >
              Stake Tokens
            </button>
            {stakeSubmitted && <p className="text-orange-500 mt-2">Staking successful! Total Staked: {stakedAmount}</p>}
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => {
            withdrawCoin();
          }}
          className="bg-red-500 text-white font-bold py-3 px-8 rounded focus:outline-none hover:bg-red-700 focus:ring-2 focus:ring-red-500 mt-8 text-xl"
        >
          Withdraw Tokens
        </button>
        {withdrawSubmitted && <p className="text-red-500 mt-2">Withdrawal successful! Total Withdrawn: {withdrawnAmount}</p>}
      </div>
    </main>
  );
}
