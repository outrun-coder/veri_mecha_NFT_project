/* eslint-disable @typescript-eslint/ban-ts-comment */
import { browser } from '$app/environment'
import { derived, writable } from 'svelte/store';

import { ethers } from 'ethers'

import { createFigureConverterWith } from "block-project-utils";
import { networkConfigs } from "../spec-config"
import NFT_VM_ABI from '../abis/NFT_VM.json';
import { delay } from 'block-project-utils/mock-network-delay';
import { checkNFTaccountDetailsFrom } from 'block-project-utils/development-logging';

class NftMintingApp {
  convert: any = createFigureConverterWith(ethers);

  // store: any
  
  // STATE
  isLoading = writable(true);
  isProcessing = writable(false);
  userOptedToConnect = writable(false);

  // NETWORK
  // network_: any = {};
  chanId_: any = '';

  // WEB3 CONNECTIONS
  provider: any
  uiNFTcontract: any

  // NFT CONTRACT DETAILS
  nftCost_ = 0;
  nftName_ = '';
  nftSymbol_ = '';
  nftMintOpenDate_ = 0;
  
  nftTotalMintsLeft_: any = writable();
  nftBaseURI_: any = writable(); // X

  // USER / ACCOUNT(S)
  userAddress_: any = writable(null); // ''
  // TODO - ADD COLLECTION
  // TODO - ETH BALANCE VERIFICATION

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

  // SETUP ACTIONS
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
    this.uiNFTcontract = new ethers.Contract(nft_VM.address, NFT_VM_ABI, this.provider);
  }

  setNFTcontractData = async() => {
    const { uiNFTcontract } = this;
    
    this.nftCost_ = await uiNFTcontract.xBaseCost();
    this.nftName_ = await uiNFTcontract.xName();
    this.nftSymbol_ = await uiNFTcontract.xSymbol();
    this.nftMintOpenDate_ = await uiNFTcontract.xGroupMintOpenDate();
    
    await this.setTotalMintsLeft();

    this.nftBaseURI_.set(await uiNFTcontract.xBaseURI()); // X
  }

  activateWeb3EventListeners = async() => {    
    // ! ON ACCOUNT CHANGE
    // @ts-ignore
    (window.ethereum) ? window.ethereum.on('accountsChanged', async () => {
      let optedIn = false;
      this.userOptedToConnect.subscribe(value => optedIn = value);
      (optedIn) ? this.connectUserAccount() : null;
    })
    : null;

    // TODO - NETWORK CHANGED
    // ! ON NETWORK CHANGE
    // window.ethereum.on('chainChanged', () => {
    //   // ! Teardown(s)
    //   window.location.reload();
    // });
  }

  setupApplication = async() => {
    try {
      await this.setupNetworkConnections();
      await this.setNFTcontractData();
      this.activateWeb3EventListeners();
      this.isLoading.set(false);
    } catch(error) {
      console.error('(!) CAUGHT ERROR DURING SETUP(!) :', error);
      // TODO - CREATE TOP LEVEL ERROR HANDLING CONVENTION
    }
  }

  constructor() {
    // TODO [] - STORE FOR RECORD MANAGEMENT
    // this.store = "TEST_STORE" // X

    if (browser) {
      this.setupApplication();
    }
  }

  // HANDLERS
  // TODO -
  dropAccountConnection = () => {
    // userAddress
    // tokenCollection
    // ethBalance
  }

  setTotalMintsLeft = async() => {
    this.nftTotalMintsLeft_.set(await this.uiNFTcontract.xGroupTotalMintsLeft());
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

    // TODO - SET AND READ IN GALLERY

    return tokenCollection;
  }

  connectUserAccount = async() => {
    this.isLoading.set(true);
    await delay(1000);
    const userAddress = await this.collectAccount();
    
    // TODO - loadETHBalances
    const tokenCollection = await this.loadTokenCollection({
      userAddress
    });
    
    this.isLoading.set(false);

    const result = {
      userAddress,
      tokenCollection
    }

    // TODO - IF VERBOSE TESTING
    checkNFTaccountDetailsFrom(result);

    return result;
  }

  // CONTRACT ACTIONS
  processMintsBy = async(numberOfMints: number) => {
    const { provider, uiNFTcontract, convert, nftCost_ } = this;

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

      trx = await uiNFTcontract.connect(signer).andMintFor(numberOfMints, { value: costToMint });
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

  // TODO [] - getResourcesForToken()
}

// START - SINGLETON
const NftMinting = new NftMintingApp();

// ABSTRACTION HELPERS
export const shortAddress = derived(NftMinting.userAddress_, ($userAddress_) => {
  //@ts-ignore
  return ($userAddress_) ? `${$userAddress_.slice(0,5)}...${$userAddress_.slice(38,42)}` : 'N/A';
});

export default NftMinting;
