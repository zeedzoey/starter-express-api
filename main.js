import { createWeb3Modal, walletConnectProvider, EIP6963Connector } from './node_modules/@web3modal/wagmi';

import { configureChains, createConfig } from './node_modules/@wagmi/core';
import { mainnet } from './node_modules/@wagmi/core/dist/chains.js';
import { publicProvider } from './node_modules/@wagmi/core/dist/providers/public';
import { InjectedConnector } from './node_modules/@wagmi/core';
import { CoinbaseWalletConnector } from './node_modules/@wagmi/core/dist/connectors/coinbaseWallet';
import { WalletConnectConnector } from './node_modules/@wagmi/core/dist/connectors/walletConnect';

// 1. Define constants
const projectId = 'ae41b4e768356491a7ee9a90f55c0c0f'

// 2. Configure wagmi client
const { chains, publicClient } = configureChains([mainnet], [
  walletConnectProvider({ projectId }),
  publicProvider()
])

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
  ],
  publicClient
})

// 3. Create modal
const modal = createWeb3Modal({ wagmiConfig, projectId, chains })