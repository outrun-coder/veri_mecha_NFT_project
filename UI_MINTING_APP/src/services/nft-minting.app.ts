/* eslint-disable @typescript-eslint/ban-ts-comment */
import { browser } from '$app/environment'
import { derived, writable } from 'svelte/store';

import { ethers } from 'ethers'

import { networkConfigs } from "../spec-config"
import NFT_VM_ABI from '../abis/NFT_VM.json';

class NftMintingApp {

  store: any
  
  provider: any
  nftContract: any

  network_: any = writable({});
  chanId_: any = writable('');

  userAddress_: any = writable(null); // ''

  setupNetworkConnections = async() => {
    // ! CONNECTION
    //@ts-ignore
    this.provider = new ethers.BrowserProvider(window.ethereum);
    const network = await this.provider.getNetwork();
    const chainId = network.chainId.toString();

    // ! CONTRACT
    const { nft_VM } = networkConfigs[chainId];
    this.contractNFT = new ethers.Contract(nft_VM.address, NFT_VM_ABI, this.provider);

    this.network_.set(network);
    this.chanId_.set(chainId);
  }

  setupUserConnection = async() => {
    //@ts-ignore
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = ethers.getAddress(accounts[0]);

    this.userAddress_.set(userAddress);
  }

  setupApplication = async() => {
    await this.setupNetworkConnections();
    await this.setupNFTcontractData();
  }

  constructor() {
    // TODO [] - STORE FOR RECORD MANAGEMENT
    // [] - USER

    this.store = "TEST_STORE"

    if (browser) {
      this.setupApplication();

      // TODO [] - ADD CONNECT WALLET FEATURE from amm
      // this.setupUserConnection();
    }
  }
}

const NftMinting = new NftMintingApp();

export const shortAddress = derived(NftMinting.userAddress_, ($userAddress_) => {
  //@ts-ignore
  return ($userAddress_) ? `${$userAddress_.slice(0,5)}...${$userAddress_.slice(38,42)}` : 'N/A';
});

export default NftMinting;
