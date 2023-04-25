// OK [x] - LIST / IMPORT
// - DEPS
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';

// - UTILS
import { testerUtil } from "block-project-utils";
const apple = testerUtil
console.log(`>> CONFIRM TESTER:`, apple);


// CONTRACT TEST SUITE
describe('NFT_POC', () => {
// OK [x] - DESCRIBE CONTRACT & PROPS

  const CONTRACT_PROPS = {
    _name: 'Veri-Mecha',
    _symbol: 'VMECH'
  }

  // SUITE CONSTANTS
  let nftContract: Contract;

// TODO [] - DETERMINE ACTORS


// OK [x] - DEPLOYMENT
  describe('Deployment of', () => {

    beforeEach(async () => {
      const NFT_factory = await ethers.getContractFactory('NFT_POC');
      // TODO [] - Consolidate deployment signature to a single interface
      nftContract = await NFT_factory.deploy(CONTRACT_PROPS._name, CONTRACT_PROPS._symbol);
    });

    it('has correct name', async () => {
      expect(await nftContract.xName()).to.equal(CONTRACT_PROPS._name);
    });
    it('has correct symbol', async () => {
      expect(await nftContract.xSymbol()).to.equal(CONTRACT_PROPS._symbol);
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