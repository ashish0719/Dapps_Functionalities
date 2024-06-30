import { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "./styles.module.css"; // Import CSS module

import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState(1); // State for deposit amount
  const [withdrawAmount, setWithdrawAmount] = useState(1); // State for withdraw amount
  const [transactions, setTransactions] = useState([]); // State for transactions

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async (amount) => {
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      setTransactions([
        ...transactions,
        { type: "Deposit", amount: amount, txHash: tx.hash },
      ]);
      getBalance();
    }
  };

  const withdraw = async (amount) => {
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      setTransactions([
        ...transactions,
        { type: "Withdraw", amount: amount, txHash: tx.hash },
      ]);
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button className={styles.connectButton} onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p className={styles.balance}>Your Balance: {balance}</p>
        <div className={styles.buttonContainer}>
          <div>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className={styles.amountInput}
              placeholder="Deposit Amount"
            />
            <button
              className={styles.actionButton}
              onClick={() => deposit(depositAmount)}
            >
              Deposit {depositAmount} ETH
            </button>
          </div>
          <div>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              className={styles.amountInput}
              placeholder="Withdraw Amount"
            />
            <button
              className={styles.actionButton}
              onClick={() => withdraw(withdrawAmount)}
            >
              Withdraw {withdrawAmount} ETH
            </button>
          </div>
        </div>
        {renderTransactionHistory()}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  const renderTransactionHistory = () => {
    return (
      <div className={styles.transactionHistory}>
        <h2>Transaction History</h2>
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              {tx.type} {tx.amount} ETH - Tx Hash: {tx.txHash}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <main className={styles.container}>
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
    </main>
  );
}
