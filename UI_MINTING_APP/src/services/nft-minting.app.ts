/* eslint-disable @typescript-eslint/ban-ts-comment */
import { browser } from '$app/environment'
import { derived, writable } from 'svelte/store';

import { ethers } from 'ethers'

import { createFigureConverterWith } from "block-project-utils";
import { networkConfigs } from "../spec-config"
import NFT_VM_ABI from '../abis/NFT_VM.json';

class NftMintingApp {
  convert: any = createFigureConverterWith(ethers);

  store: any
  
  isLoading = writable(true);
  isProcessing = writable(false);

  provider: any
  contractNFT: any

  nftCost_ = 0;

  nftName_: any = writable('');
  nftSymbol_: any = writable();
  nftBaseURI_: any = writable();
  nftMintOpenDate_: any = writable();
  nftTotalMintsLeft_: any = writable();

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

  setTotalMintsLeft = async() => {
    this.nftTotalMintsLeft_.set(await this.contractNFT.xGroupTotalMintsLeft());
  }

  setNFTcontractData = async() => {
    const { contractNFT } = this;
    
    this.nftName_.set(await contractNFT.xName());
    this.nftSymbol_.set(await contractNFT.xSymbol());
    this.nftCost_ = await contractNFT.xBaseCost();
    
    this.nftMintOpenDate_.set(await contractNFT.xGroupMintOpenDate());
    this.nftBaseURI_.set(await contractNFT.xBaseURI());
    await this.setTotalMintsLeft();
  }

  setupApplication = async() => {
    await this.setupNetworkConnections();
    await this.setNFTcontractData();
    this.isLoading.set(false);
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

  processMintsBy = async(numberOfMints: number) => {
    const { provider, contractNFT, convert, nftCost_ } = this;

    this.isProcessing.set(true);

    const ethPerMint = convert.WeiToTokens(nftCost_);
    const { costToMint } = convert.toCostByNumberOfMints({
      numberOfMints,
      ethPerMint
    });

    let trx;
    try {
      const signer = await provider.getSigner();
      // console.log('>> SIGNER:', signer.address);

      trx = await contractNFT.connect(signer).andMintFor(numberOfMints, { value: costToMint });
      await trx.wait();

      console.log(`>> MINT SUCCESS:`);
      this.isProcessing.set(false);
      return {
        success: true,
        error: null,
        data: {
          trx
        }
      };
      
    } catch(error) {
      console.error('(!) ERROR MINTING (!)', error);
      this.isProcessing.set(false);
      return {
        success: false,
        error,
        data: {
          trx
        }
      };
    }
  }

  // STATE WATCHING
  appIsWorking = derived([this.isLoading, this.isProcessing], ([$isLoading, $isProcessing]) => {
    return $isLoading || $isProcessing;
  });
}

const NftMinting = new NftMintingApp();

// ABSTRACTION HELPERS
export const shortAddress = derived(NftMinting.userAddress_, ($userAddress_) => {
  //@ts-ignore
  return ($userAddress_) ? `${$userAddress_.slice(0,5)}...${$userAddress_.slice(38,42)}` : 'N/A';
});

export default NftMinting;
