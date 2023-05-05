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
  userAddress: any

  setupNetworkConnections = async() => {
    // ! CONNECTION
    //@ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const chainId = network.chainId.toString();

    // ! CONTRACT
    const { nft_VM } = networkConfigs[chainId];
    const nftContract = new ethers.Contract(nft_VM.address, NFT_VM_ABI, provider);

    this.provider = provider;
    this.network = network;
    this.chainId = chainId;
    //
    this.nftContract = nftContract;
  }

  setupUserConnection = async() => {
    //@ts-ignore
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = ethers.getAddress(accounts[0]);

    this.userAddress = userAddress;
  }

  constructor() {
    // TODO [] - STORE FOR RECORD MANAGEMENT
    // [] - USER

    this.store = "TEST_STORE"

    if (browser) {
      this.setupNetworkConnections();
      this.setupUserConnection();
      // TODO [] - setupNFTcontractData();
    }
  }
}

const NftMinting = new NftMintingApp();

export default NftMinting;
