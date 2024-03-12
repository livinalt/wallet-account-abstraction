
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useState } from 'react';
import ABI from './abi.json';
import FactoryABI from './FactoryABI.json'

export default function Home() {

  // const contractAddress = "0x931a4807fbE243fBe10Fa9FF84e3744E67A9c735";
  const contractAddress = "0x931a4807fbE243fBe10Fa9FF84e3744E67A9c735"; // new created SmartWallet Addres from the factory
  const abi = ABI;

  // hooks for required variables
  const [provider, setProvider] = useState();
  
  // response from read operation is stored in the below variable
  const [balance, setBalance] = useState();

  // the value entered in the input field is stored in the below variable
  const [depositAmount, setDepositAmount] = useState(0);
  const [transferAddress, setTransferAddress] = useState("0x");
  const [transferAmount, setTransferAmount] = useState(0);

  // the variable is used to invoke loader
  const [depositLoader, setDepositLoader] = useState(false)
  const [withdrawLoader, setWithdrawLoader] = useState(false)
  const [retrieveLoader, setRetrieveLoader] = useState(false)

  async function initWallet(){
    try {
      // check if any wallet provider is installed. i.e metamask xdcpay etc
      if (typeof window.ethereum === 'undefined') {
        console.log("Please install wallet.")
        alert("Please install wallet.")
        return
      }
      else{
          // raise a request for the provider to connect the account to our website
          const web3ModalVar = new Web3Modal({
            cacheProvider: true,
            providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
            },
          },
        });
        
        const instanceVar = await web3ModalVar.connect();
        const providerVar = new ethers.providers.Web3Provider(instanceVar);
        setProvider(providerVar)
        return
      }

    } catch (error) {
      console.log(error)
      return
    }
  }

  async function readDeposit(){
    try {
      setRetrieveLoader(true)
      const signer = provider.getSigner();
      console.log(signer);
  
      // initalize smartcontract with the essentials detials.
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = await smartContract.connect(signer);
  
      // interact with the methods in smart contract
      const response = await contractWithSigner.getDeposit();
  
      console.log(parseInt(response))
      setBalance(parseInt(response))
      setRetrieveLoader(false)
      return
    } catch (error) {
      console.log(error)
      setRetrieveLoader(false)
      return
    }
  }
  
  async function makeDeposit(){
    try {
      setDepositLoader(true)
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);
      

      // interact with the methods in smart contract as it's a write operation, we need to invoke the transation usinf .wait()
      const depositTX = await contractWithSigner.addDeposit(depositAmount);
      const response = await depositTX.wait()
      alert(await response)
      setDepositLoader(false)

      alert(`You have successfully deposited into your account`)   
      return

    } catch (error) {
      console.log(error)
      setDepositLoader(false)
      return
    }
  }
  
  
  async function withdrawal(){
    try {
      setWithdrawLoader(true)
      if (!provider) return;
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);

      // interact with the methods in smart contract as it's a write operation, we need to invoke the transation usinf .wait()
      const withdrawTX = await contractWithSigner.withdrawDepositTo(transferAddress, transferAmount);
      const response = await withdrawTX.wait()
      console.log(await response)
      setWithdrawLoader(false)

      alert(`Transfer transaction is successful`)   
      return

    } catch (error) {
      alert(error)
      setWithdrawLoader(false)
      return
    }
  }

  async function deploySmartWallet() {
    try {
      if (!provider) {
        console.error("Provider not available.");
        return;
      }
      const signer = provider.getSigner();
      const factoryABI = FactoryABI;
      const factoryAddress = "0xF1c6Beea38F607D65226d8cC609a9149b015cd9E"; // Replace with actual factory contract address
      const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);
      const transaction = await factoryContract.createSmartWallet(await signer.getAddress());
      await transaction.wait();
      alert("SmartWallet deployed successfully!");
    } catch (error) {
      console.error("Error deploying SmartWallet:", error);
      alert("Error deploying SmartWallet. Please check the console for details.");
    }
  }
  

  useEffect(() => {
    initWallet();
  }, []);
  

  return (
    
    <div className="wallet-container">
    <h1>Smart Contract Wallet</h1>

    <div>
      <h2>Check Balance</h2>
      <button onClick={readDeposit}>
        Check Balance
      </button>
      <p>Your account balance is <span>{balance ? balance : 'N/A'}</span></p>
    </div>

    <div>
      <h2>Make a Deposit</h2>
      <input
        type="text"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={makeDeposit}>
        Make Deposit
      </button>
    </div>

    <div>
      <h2>Transfer Funds</h2>
      <input
        type="text"
        value={transferAddress}
        onChange={(e) => setTransferAddress(e.target.value)}
        placeholder="Enter address"
      />
      <input
        type="text"
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={withdrawal}>
        Transfer Funds
      </button>
    </div>

    <div>
      <button onClick={deploySmartWallet}>
        Deploy SmartWallet
      </button>
    </div>
  </div>

  )
}
