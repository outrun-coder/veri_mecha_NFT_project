// OK [x] - LIST / IMPORT
// - DEPS
import { expect } from 'chai';
import { ethers } from 'hardhat';

// - TYPES
import { Contract, ContractTransaction } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// - UTILS
// TODO [] - create a logResult util
import { createFigureConverterWith, generateContract } from "block-project-utils";

const figureOut = createFigureConverterWith(ethers);


// CONTRACT TEST SUITE
describe('NFT_POC...', () => {
// OK [x] - DESCRIBE CONTRACT & PROPS
  const ethPerMint = 0.5; // RESEARCH - RELATIVE PROJECT MINTING COSTS

  const BASE_DEPLOYMENT_PROPS = {
    _name: 'Veri-Mecha',
    _symbol: 'VMECH',
    _baseCost: figureOut.TokensToWei(ethPerMint),
    //
    // _baseTokenStagedURI: '',
    // _baseTokenPendingURI: '',
    _baseTokenURI: 'asdf'
  };

  const FIRST_SEASON_CONFIG = {
    // _groupId: '0000',
    _groupMintingDate: (Date.now()).toString().slice(0, 10), // now
    _groupTotalMintsLeft: 5
  }

  const targetContractKey = 'NFT_POC';
  const deploymentArgs = {
    ...BASE_DEPLOYMENT_PROPS,
    ...FIRST_SEASON_CONFIG
  }

  // ! STATE INDEX
  let nftContract: Contract;
  let trx: ContractTransaction;
  
  // ! ACTORS
  let deployer: SignerWithAddress;
  let deployerAddress: string;
  let minter_1: SignerWithAddress;
  let minter_1Address: string;
  let minter_2: SignerWithAddress;
  // let minter_2Address: string;

  // ! MINTING ARGS
  const specMintQty_0 = 5;
  const {
    ethRequiredToMint,
    costToMint: specMintCost_0
  } = figureOut.howMuchToMint({
    mintQuantity: specMintQty_0,
    ethPerMint
  });

  // OK [x] - DETERMINE ACTORS
  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    [
      deployer,
      minter_1,
      minter_2
    ] = accounts;
    deployerAddress = deployer.address;
    minter_1Address = minter_1.address;
  });

  // OK [x] - DEPLOYMENT
  describe('\n Deployment of... \n', () => {

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
        expect(await nftContract.owner()).to.equal(deployerAddress);
      });
    });

    describe(`- First season setup`, () => {
      // RESEARCH - IF COMPOUND TOKEN ID IS POSSIBLE AND USEABLE
      // it(`has the first season groupId: ${deploymentArgs._groupId}`, async () => {
      //   expect(await nftContract.xGroupId()).to.equal(deploymentArgs._groupId);
      // });
      it(`provides the group minting date: ${deploymentArgs._groupMintingDate}`, async () => {
        expect(await nftContract.xGroupMintOpenDate()).to.equal(deploymentArgs._groupMintingDate);
      });
      it(`provides the group total mints left: ${deploymentArgs._groupTotalMintsLeft}`, async () => {
        expect(await nftContract.xGroupTotalMintsLeft()).to.equal(deploymentArgs._groupTotalMintsLeft);
      });
    });
  });
  
  // OK [x] - MINTING
  describe('\n Minting... \n', () => {
    console.log('\n >> PREP FOR MINTING >> \n');
    console.table({ ethPerMint, specMintQty_0, ethRequiredToMint, costToMintInWei: specMintCost_0.toString() });

    beforeEach(async () => {
      nftContract = await generateContract({ ethers, targetContractKey, deploymentArgs });
    });

    describe(`\n - will be graceful if...`, () => {
      const lowBall = figureOut.TokensToWei(1);

      it(`it rejects insufficient mint payment of: ${figureOut.WeiToTokens(lowBall)}`, async() => {
        const underFundedMint = nftContract.connect(minter_1).andMintFor(specMintQty_0, { value: lowBall });
        await expect(underFundedMint).to.be.reverted;
      });
      it(`it rejects a non funded mint request`, async() => {
        const nonFundedMint = nftContract.connect(minter_1).andMintFor(specMintQty_0);
        await expect(nonFundedMint).to.be.reverted;
      });
      
      it('it rejects a 0 mint quantity w/ payment', async() => {
        const nullMint = nftContract.connect(minter_1).andMintFor(0, { value: specMintCost_0 });
        await expect(nullMint).to.be.reverted;
      });

      it('it does not allow additional mints after GROUP_TOTAL_MINTS_LEFT has been zeroed out', async () => {
        console.log('>> "LATE TO THE PARTY"');
        const remaining = await nftContract.xGroupTotalMintsLeft();
        const {
          // ethRequiredToMint,
          costToMint: costToMintRemaining
        } = figureOut.howMuchToMint({
          mintQuantity: remaining,
          ethPerMint
        });

        console.log(`>> CONTRACT HAS ${remaining} REMAINING TO MINT!`);
        console.log('>> MINITNG THE REST...');
        trx = await nftContract.connect(minter_1).andMintFor(remaining, { value: costToMintRemaining });
        await trx.wait();
        
        console.log(`>> CONTRACT HAS ${await nftContract.xGroupTotalMintsLeft()} REMAINING TO MINT!`);
        console.log('>> TRYING FOR ONE MORE...');
        const tooLateTrx = nftContract.connect(minter_2).andMintFor(1, { value: figureOut.TokensToWei(ethPerMint) });
        
        // NOTE - SWAP COMMENTED LINES TO SEE CONTRACT EXCEPTION
        await expect(tooLateTrx).to.be.reverted;
        // await tooLateTrx;
      });

      it('it does not allow more NFTs to be minted than GROUP_TOTAL_MINTS_LEFT', async () => {
        const overMintQuantity = 6;
        const {
          // ethRequiredToMint,
          costToMint: costToOverMint
        } = figureOut.howMuchToMint({
          mintQuantity: overMintQuantity,
          ethPerMint
        });

        console.log('>> "OVER MINTING"');
        console.log(`>> CONTRACT HAS ${await nftContract.xGroupTotalMintsLeft()} REMAINING TO MINT!`);
        console.log('>> OVER MINT REQUESTING: ', overMintQuantity);

        const overMintTrx = nftContract.connect(minter_1).andMintFor(overMintQuantity, { value: costToOverMint });
        
        // NOTE - SWAP COMMENTED LINES TO SEE CONTRACT EXCEPTION
        await expect(overMintTrx).to.be.reverted;
        // await overMintTrx;
      });
    });

    describe(`\n - will be successful if...`, () => {
      beforeEach(async() => {
        trx = await nftContract.connect(minter_1).andMintFor(specMintQty_0, { value: specMintCost_0 });
        await trx.wait();
      });

      it(`trx emits a "MintCompleted" event for ${specMintQty_0} minted, from: minter_1`, async () => {
        await expect(trx).to.emit(nftContract, 'MintCompleted')
          .withArgs(specMintQty_0, minter_1Address);
      })

      it('trx updates the contract ETHER balance', async() => {
        expect(await ethers.provider.getBalance(nftContract.address)).to.equal(specMintCost_0);
      });
    });
  });

  describe('\n Minting before GROUP_MINT_OPEN_DATE... \n', () => {
    const futureDate = 'May 26, 2030 18:00:00';
    const specToPreLaunchDeploymentArgs = {
      ...deploymentArgs,
      ...{
        _groupMintingDate: new Date(futureDate).getTime().toString().slice(0, 10) // NOTE - FUTURE DATE >> 
      }
    };

    beforeEach(async () => {
      nftContract = await generateContract({ ethers, targetContractKey, deploymentArgs: specToPreLaunchDeploymentArgs });
    });

    describe(`- will be graceful if...`, () => {
      it(`it rejects minting before launch date: ${futureDate}`, async() => {
        const validButEarly = nftContract.connect(minter_1).andMintFor(specMintQty_0, { value: specMintCost_0 });
        
        // NOTE - SWAP COMMENTED LINES TO SEE CONTRACT EXCEPTION
        await expect(validButEarly).to.be.reverted;
        // await validButEarly;
      });
    });
  });

  // OK [x] - RETURNS AND VERIFIES COLLECTION GROUP(s)
  describe(`\n NFT verification... \n`, () => {
    const specMintQty_1 = 4;
    const {
      // ethRequiredToMint,
      costToMint: specMintCost_1
    } = figureOut.howMuchToMint({
      mintQuantity: specMintQty_1,
      ethPerMint
    });
   
    console.log('\n >> PREP FOR NFT ID VERIFICATION \n');
    console.table({specMintQty_1, specCostToMintInWei: specMintCost_1.toString()});

    beforeEach(async () => {
      nftContract = await generateContract({ ethers, targetContractKey, deploymentArgs });
      trx = await nftContract.connect(minter_1).andMintFor(specMintQty_1, {value: specMintCost_1 });
      await trx.wait();
    });

    describe(`- will be successful if...`, () => {
      it(`it returns all the NFTs for a given owner`, async() => {
        const assetCollection = await nftContract.getAssetCollectionByOwner(minter_1Address);

        // console.log('>> ASSETS:', assetCollection);
        
        expect(assetCollection.length).to.equal(specMintQty_1);
        expect(assetCollection[0].toString()).of.equal('1');
        expect(assetCollection[1].toString()).of.equal('2');
        expect(assetCollection[2].toString()).of.equal('3');
        expect(assetCollection[3].toString()).of.equal('4');
      });

      // TODO - RETURNS THE ADDRESS FOR OWNER
      // TODO - RETURNS THE COLLECTION COUNT FOR OWNER
      // TODO - BLOCKS INVALID URI CHECK REQUEST
      // TODO - 
    });
  });
  
  // TODO 
  // ! PROCESS MANAGEMENT
  
  // ! - PROCESS GROUP MIGRATION
  // ! - UPDATE GROUP MINTING
  // ! - UPDATE GROUP META
  
  // ! - UPDATE CONTRACT META
  // ! - PROCESS WITDRAWL OF FUNDS RAISED
  
});

//
// TODO [] -