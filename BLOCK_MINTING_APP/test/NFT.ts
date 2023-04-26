// OK [x] - LIST / IMPORT
// - DEPS
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// - UTILS
// TODO [] - create a renderResult util
import { testerUtil } from "block-project-utils";
const apple = testerUtil
console.log(`>> CONFIRM TESTER:`, apple);


// CONTRACT TEST SUITE
describe('NFT_POC... \n', () => {
// OK [x] - DESCRIBE CONTRACT & PROPS

  const BASE_DEPLOYMENT_PROPS = {
    _name: 'Veri-Mecha',
    _symbol: 'VMECH',
    _baseCost: 1, // fix - .01 throws underflow error
    //
    // _baseTokenStagedURI: '',
    // _baseTokenPendingURI: '',
    _baseTokenURI: 'asdf'
  };

  const FIRST_SEASON_CONFIG = {
    _groupId: '01'
  }

  const CONTRACT_PROPS = {
    ...BASE_DEPLOYMENT_PROPS,
    ...FIRST_SEASON_CONFIG
  }

  // SUITE CONSTANTS
  let nftContract: Contract;
  // trx: ?
  let deployer: SignerWithAddress;
  let deployerAddress: string;

  // TODO [-] - DETERMINE ACTORS
  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    [
      deployer
    ] = accounts;
    deployerAddress = deployer.address;
  });

  // OK [x] - DEPLOYMENT
  describe('Deployment of...\n', () => {

    beforeEach(async () => {
      const NFT_factory = await ethers.getContractFactory('NFT_POC');
      // OK [x] - Consolidate deployment signature to a single interface
      nftContract = await NFT_factory.deploy(CONTRACT_PROPS);
    });

    describe(`- Base setup:`, () => {
      
      it(`has correct name: ${CONTRACT_PROPS._name}`, async () => {
        expect(await nftContract.xName()).to.equal(CONTRACT_PROPS._name);
      });
      it(`has correct symbol: ${CONTRACT_PROPS._symbol}`, async () => {
        expect(await nftContract.xSymbol()).to.equal(CONTRACT_PROPS._symbol);
      });
      it(`has correct base cost: ${CONTRACT_PROPS._baseCost}`, async () => {
        expect(await nftContract.xBaseCost()).to.equal(CONTRACT_PROPS._baseCost);
      });
      it(`has correct base URI: ${CONTRACT_PROPS._baseTokenURI}`, async () => {
        expect(await nftContract.xBaseURI()).to.equal(CONTRACT_PROPS._baseTokenURI);
      });
      it(`returns the owner: ${'<< TBD'}`, async () => {
        expect(await nftContract.owner()).to.equal(deployerAddress); // FIX - needs OZ API 
      });
    });
    
    describe(`- First season setup`, () => {
      it(`has the first season groupId: ${CONTRACT_PROPS._groupId}`, async () => {
        expect(await nftContract.xGroupId()).to.equal(CONTRACT_PROPS._groupId);
      });
    });
  });

  // ! PROCESS MANAGEMENT

  // ! - PROCESS GROUP MIGRATION
  // ! - UPDATE GROUP MINTING
  // ! - UPDATE GROUP META
    
  // ! - UPDATE CONTRACT META
  // ! - PROCESS WITDRAWL OF FUNDS RAISED


  // TODO [] -
  // ! ACCESS CONTRACT
  // - DETAILS
  // - STATE
  // - RECORDS
  // - TOKEN DETAILS


  // TODO [] -
  // ! MINTING

});

//
// TODO [] -