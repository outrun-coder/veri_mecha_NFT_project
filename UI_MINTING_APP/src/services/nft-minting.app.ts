/* eslint-disable @typescript-eslint/ban-ts-comment */
import { browser } from '$app/environment'
import { derived, writable } from 'svelte/store';

import { ethers } from 'ethers'

import { createFigureConverterWith } from "block-project-utils";
import { networkConfigs } from "../spec-config"
import NFT_VM_ABI from '../abis/NFT_VM.json';
import { delay } from 'block-project-utils/mock-network-delay';

class NftMintingApp {
  convert: any = createFigureConverterWith(ethers);

  store: any
  
  isLoading = writable(true);
  isProcessing = writable(false);
  hasAccountConnection = writable(false);

  provider: any
  contractNFT: any

  nftCost_ = 0;
  nftName_ = '';
  nftSymbol_ = '';
  nftMintOpenDate_ = 0;
  
  nftTotalMintsLeft_: any = writable();
  nftBaseURI_: any = writable(); // X

  // network_: any = {};
  chanId_: any = '';

  userAddress_: any = writable(null); // ''

  setupNetworkConnections = async() => {
    // ! CONNECTION
    //@ts-ignore
    this.provider = new ethers.BrowserProvider(window.ethereum);
    const network = await this.provider.getNetwork();
    const chainId = network.chainId.toString();

    // this.network_ = network;
    this.chanId_ = chainId;

    // ! CONTRACT
    const { nft_VM } = networkConfigs[chainId];
    this.contractNFT = new ethers.Contract(nft_VM.address, NFT_VM_ABI, this.provider);
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
    
    this.nftCost_ = await contractNFT.xBaseCost();
    this.nftName_ = await contractNFT.xName();
    this.nftSymbol_ = await contractNFT.xSymbol();
    this.nftMintOpenDate_ = await contractNFT.xGroupMintOpenDate();
    
    await this.setTotalMintsLeft();

    this.nftBaseURI_.set(await contractNFT.xBaseURI()); // X
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

  collectAccount = async() => {
    //@ts-ignore
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = ethers.getAddress(accounts[0]);

    // TODO - COLLECT SIGNER ? HERE OR AT TIME OF TRX INVOCATION ?

    this.userAddress_.set(userAddress);
    return userAddress;
  }

  loadTokenCollection = async(args: any) => {
    const { userAddress } = args;
    const { uiNFTcontract } = this;
    const tokenCollection = await uiNFTcontract.getTokenCollectionWith(userAddress);

    console.log('>> TOKEN_COLLECTION HAS:', tokenCollection.length);
    tokenCollection.forEach((t: any) => {
      console.log('>> VERIFY TOKEN:', t.toString());
    });

    // TODO - SET AND READ IN GALLERY
  }

  connectUserAccount = async() => {
    this.isLoading.set(true);
    await delay(1000);
    const userAddress = await this.collectAccount();
    
    // loadBalances
    await this.loadTokenCollection({
      userAddress
    });
    
    console.log('>> CHECK APP:', this);
    
    this.isLoading.set(false);
    
    // TODO - return result of process to invocation
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
          numberOfMints,
          estCostToMint: convert.WeiToTokens(costToMint),
          ethPerMint,
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

  mintGroupIsExhausted = derived(this.nftTotalMintsLeft_, ($nftTotalMintsLeft_) => {
    if (typeof $nftTotalMintsLeft_ === 'bigint') {
      // is bigint
      // @ts-ignore
      return parseInt($nftTotalMintsLeft_) === 0;
    } else {
      // is undefined
      return false;
    }
  });
}

const NftMinting = new NftMintingApp();

// ABSTRACTION HELPERS
export const shortAddress = derived(NftMinting.userAddress_, ($userAddress_) => {
  //@ts-ignore
  return ($userAddress_) ? `${$userAddress_.slice(0,5)}...${$userAddress_.slice(38,42)}` : 'N/A';
});

export default NftMinting;
