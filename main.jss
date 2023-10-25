import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/vue';

// 1. Get projectId
const projectId = 'ae41b4e768356491a7ee9a90f55c0c0f'

// 2. Set chains
const chains = [1, 42161]

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

const modal = createWeb3Modal({
  ethersConfig: defaultConfig({ 
    metadata,
    defaultChainId: 1,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: '...' // used for the Coinbase SDK
  }),
  chains,
  projectId
})