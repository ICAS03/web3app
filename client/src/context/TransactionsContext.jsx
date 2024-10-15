import React, { useState,useEffect } from "react";
import {ethers} from 'ethers';
import { contractABI , contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const getEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress , contractABI ,signer);

    return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount , setCurrentAccount] = useState("");
    const [formData , setFormData] = useState({ addressTo: '' , amount:'' , keyword:'' , message:''});
    const [isLoading , setIsLoading] = useState(false);
    const [transactionCount , setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions , setTransactions]  = useState([]);
    
    const getAllTransaction = async () => {
        try {
            if(ethereum) {
                const transactionContract = await getEthereumContract();
                const availableTransactions = await transactionContract.getAllTransaction();

                //Make a structured transaction using map function
                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleDateString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: parseInt(transaction.amount._hex) / (10 ** 18)
                }))

                setTransactions(structuredTransactions);
                
            } else {
            console.log('Ethereum not present');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert('Please install metamask');

            const accounts = await ethereum.request({method: 'eth_accounts'});
    
            if(accounts.length){
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No accounts found");
            }
        } catch (error){
            console.log(error);
            throw new Error("No Ethereum Object");
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert('Please install metamask');
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum Object");
        }
    }

    const handleChange = (e , name) =>{
        setFormData((prevState) => ({...prevState , [name]: e.target.value}));
    }

    const sendTransaction = async() => {
        try {
            if(!ethereum) return alert("Please install metamask");
            const {addressTo , amount , keyword , message} = formData;
            const transactionContract = await getEthereumContract();
            const parsedAmount = ethers.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //0.0000021 eth
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addToBlockChain(addressTo , parsedAmount , message , keyword);
            setIsLoading(true);
            console.log(`Loading Transfer - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success`);

            const transactionCount = await transactionContract.getTransactionsCount();
            // Check if the value is a BigNumber
        if (typeof transactionCount === 'object' && transactionCount._isBigNumber) {
            setTransactionCount(transactionCount.toNumber());
        } else {
            setTransactionCount(transactionCount); // Directly use it if it's a number
        }
            window.location.reload();
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum Object');
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    },[])

    return (<TransactionContext.Provider value={{connectWallet , currentAccount ,formData , sendTransaction, handleChange , transactions}}>
        {children}
    </TransactionContext.Provider>)
}