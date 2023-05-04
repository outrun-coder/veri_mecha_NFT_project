/* eslint-disable @typescript-eslint/ban-ts-comment */
import { browser } from '$app/environment'

import { ethers } from 'ethers'

import { networkConfigs } from "../spec-config"
import NFT_VM_ABI from '../abis/NFT_VM.json';

class NftMintingApp {

  store: any
  
  provider: any
  network: any
  chainId = "0000";

  nftContract: any
  user: any

  setupNetworkConnections = async() => {
    //@ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const chainId = network.chainId.toString();

    const { nft_VM } = networkConfigs[chainId];
    const nftContract = new ethers.Contract(nft_VM.address, NFT_VM_ABI, provider);

    this.provider = provider;
    this.network = network;
    this.chainId = chainId;
    //
    this.nftContract = nftContract;
  }

  constructor() {
    // TODO [] - STORE FOR RECORD MANAGEMENT
    // [] - USER

    this.store = "TEST_STORE"

    if (browser) {
      this.setupNetworkConnections();
    }
    
    this.user = "TEST_USER"

  }
}

const NftMinting = new NftMintingApp();

export default NftMinting;
