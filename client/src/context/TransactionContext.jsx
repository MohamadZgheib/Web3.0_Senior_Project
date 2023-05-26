import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [formData, setFormData] = useState({addressTo: '', amount:'', keyword:'', message:''});
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  const handleChange = (e,name ) => {
    setFormData((prevState) => ({...prevState, [name]: e.target.value}));
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask');

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        // getALlTransactions();
      } else {
        console.log('No accounts found');
      }
      console.log(accounts);
    } catch (error) {
      console.log(error);
      throw new Error('No Ethereum object.');
    }
   
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask');

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error('No Ethereum object.');
    }
  }

  const sendTransaction = async () => {
    if (!ethereum) return alert('Please install MetaMask');
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
    
      const { addressTo, amount, keyword, message } = formData;
     const transactionsContract = getEthereumContract();
     const parsedAmount = ethers.utils.parseEther(amount);
    
     await ethereum.request({
      method: "eth_sendTransaction",
      params: [{
        from: currentAccount,
        to: addressTo,
        gas: "0x5208",  //21000 GWEI
        value: parsedAmount._hex, //0.00001 
      }],
    });
    
    const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
    
    
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
    
        const transactionsCount = await transactionsContract.getTransactionCount();
        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
    } catch (error) {
      console.log(error);
    
      throw new Error("No ethereum object");
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
      {children}
    </TransactionContext.Provider>
  );
};
