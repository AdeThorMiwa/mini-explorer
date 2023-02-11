import { Alchemy, Network } from 'alchemy-sdk'

const API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY
const NETWORK = import.meta.env.VITE_NETWORK ?? Network.ETH_GOERLI

const alchemy = new Alchemy({ apiKey: API_KEY, network: NETWORK })

const useProvider = () => {
  return alchemy
}

export default useProvider
