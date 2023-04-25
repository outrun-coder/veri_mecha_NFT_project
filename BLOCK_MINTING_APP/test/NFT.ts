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

  const CONTRACT_PROPS = {
    _name: 'Veri-Mecha',
    _symbol: 'VMECH',
    _baseCost: 1, // fix - .01 throws underflow error
    //
    // _baseTokenStagedURI: '',
    // _baseTokenPendingURI: '',
    _baseTokenURI: 'asdf',
  }

  // SUITE CONSTANTS
  let nftContract: Contract;
  // trx: ?
  let deployer: SignerWithAddress;

  // TODO [] - DETERMINE ACTORS
  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    [
      deployer
    ] = accounts;
  });


  // OK [x] - DEPLOYMENT
  describe('Deployment of...', () => {

    beforeEach(async () => {
      const NFT_factory = await ethers.getContractFactory('NFT_POC');
      // OK [x] - Consolidate deployment signature to a single interface
      nftContract = await NFT_factory.deploy(CONTRACT_PROPS);
    });

    it('has correct name', async () => {
      expect(await nftContract.xName()).to.equal(CONTRACT_PROPS._name);
    });
    it('has correct symbol', async () => {
      expect(await nftContract.xSymbol()).to.equal(CONTRACT_PROPS._symbol);
    });
    it('has correct base cost', async () => {
      expect(await nftContract.xBaseCost()).to.equal(CONTRACT_PROPS._baseCost);
    });
    // TODO - RETURNS A COLLECTION GROUP(s)
    it('has correct base URI', async () => {
      expect(await nftContract.xBaseURI()).to.equal(CONTRACT_PROPS._baseTokenURI);
    });
    it('returns the owner', async () => {
      expect(await nftContract.owner()).to.equal(deployer.address); // FIX - needs OZ API 
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