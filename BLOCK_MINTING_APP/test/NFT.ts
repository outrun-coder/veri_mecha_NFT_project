// OK [x] - LIST / IMPORT
// - DEPS
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// - UTILS
// TODO [] - create a renderResult util
import { generateContract } from "block-project-utils";


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
    _groupId: '01',
    _groupMintingDate: (Date.now()).toString().slice(0, 10), // now
    _groupTotalMintsLeft: 100
  }

  const targetContractKey = 'NFT_POC';
  const deploymentArgs = {
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
      nftContract = await generateContract({ ethers, targetContractKey, deploymentArgs });
    });

    describe(`- Base setup:`, () => {
      it(`has correct name: ${deploymentArgs._name}`, async () => {
        expect(await nftContract.xName()).to.equal(deploymentArgs._name);
      });
      it(`has correct symbol: ${deploymentArgs._symbol}`, async () => {
        expect(await nftContract.xSymbol()).to.equal(deploymentArgs._symbol);
      });
      it(`has correct base cost: ${deploymentArgs._baseCost}`, async () => {
        expect(await nftContract.xBaseCost()).to.equal(deploymentArgs._baseCost);
      });
      it(`has correct base URI: ${deploymentArgs._baseTokenURI}`, async () => {
        expect(await nftContract.xBaseURI()).to.equal(deploymentArgs._baseTokenURI);
      });
      it(`returns the owner: ${'<< TBD'}`, async () => {
        expect(await nftContract.owner()).to.equal(deployerAddress); // FIX - needs OZ API 
      });
    });
    
    describe(`- First season setup`, () => {
      it(`has the first season groupId: ${deploymentArgs._groupId}`, async () => {
        expect(await nftContract.xGroupId()).to.equal(deploymentArgs._groupId);
      });
      it(`provides the group minting date: ${deploymentArgs._groupMintingDate}`, async () => {
        expect(await nftContract.xGroupMintingDate()).to.equal(deploymentArgs._groupMintingDate);
      });
      it(`provides the group total mints left: ${deploymentArgs._groupTotalMintsLeft}`, async () => {
        expect(await nftContract.xGroupTotalMintsLeft()).to.equal(deploymentArgs._groupTotalMintsLeft);
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