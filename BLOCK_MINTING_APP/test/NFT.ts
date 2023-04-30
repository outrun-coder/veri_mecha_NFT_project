// OK [x] - LIST / IMPORT
// - DEPS
import { expect } from 'chai';
import { ethers } from 'hardhat';

// - TYPES
import { Contract, ContractTransaction } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// - UTILS
// TODO_LATER [] - create a logResult util
import { createFigureConverterWith, generateContract } from "block-project-utils";

// - CONFIG
import createProjectConfigurationWith, { targetContractKey, ethPerMint } from '../config/deployment/contract-nft';

const convert = createFigureConverterWith(ethers);
const contractConfig = createProjectConfigurationWith(convert);

// CONTRACT TEST SUITE
describe('NFT_POC...', () => {
  console.log('>> TEST WILL USE CONTRACT_CONFIGURATION: \n', contractConfig);

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
  } = convert.howMuchToMint({
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
      nftContract = await generateContract({ ethers, targetContractKey, contractConfig });
    });

    describe(`- Base setup:`, () => {
      it(`has correct name: ${contractConfig._name}`, async () => {
        expect(await nftContract.xName()).to.equal(contractConfig._name);
      });
      it(`has correct symbol: ${contractConfig._symbol}`, async () => {
        expect(await nftContract.xSymbol()).to.equal(contractConfig._symbol);
      });
      it(`has correct base cost: ${contractConfig._baseCost}`, async () => {
        expect(await nftContract.xBaseCost()).to.equal(contractConfig._baseCost);
      });
      it(`has correct base URI: ${contractConfig._baseTokenURI}`, async () => {
        expect(await nftContract.xBaseURI()).to.equal(contractConfig._baseTokenURI);
      });
      it(`returns the owner: ${'<< TBD'}`, async () => {
        expect(await nftContract.owner()).to.equal(deployerAddress);
      });
    });

    describe(`- First season setup`, () => {
      // RESEARCH - IF COMPOUND TOKEN ID IS POSSIBLE AND USEABLE
      // it(`has the first season groupId: ${contractConfig._groupId}`, async () => {
      //   expect(await nftContract.xGroupId()).to.equal(contractConfig._groupId);
      // });
      it(`provides the group minting date: ${contractConfig._groupMintingDate}`, async () => {
        expect(await nftContract.xGroupMintOpenDate()).to.equal(contractConfig._groupMintingDate);
      });
      it(`provides the group total mints left: ${contractConfig._groupTotalMintsLeft}`, async () => {
        expect(await nftContract.xGroupTotalMintsLeft()).to.equal(contractConfig._groupTotalMintsLeft);
      });
    });
  });
  
  // OK [x] - MINTING
  describe('\n Minting... \n', () => {
    console.log('\n >> PREP FOR MINTING >> \n');
    console.table({ ethPerMint, specMintQty_0, ethRequiredToMint, costToMintInWei: specMintCost_0.toString() });

    beforeEach(async () => {
      nftContract = await generateContract({ ethers, targetContractKey, contractConfig });
    });

    describe(`- will be graceful if...`, () => {
      const lowBall = convert.TokensToWei(1);

      it(`it rejects insufficient mint payment of: ${convert.WeiToTokens(lowBall)}`, async() => {
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
        // console.log('>> "LATE TO THE PARTY"');
        const remaining = await nftContract.xGroupTotalMintsLeft();
        const {
          // ethRequiredToMint,
          costToMint: costToMintRemaining
        } = convert.howMuchToMint({
          mintQuantity: remaining,
          ethPerMint
        });

        // console.log(`>> CONTRACT HAS ${remaining} REMAINING TO MINT!`);
        // console.log('>> MINITNG THE REST...');
        trx = await nftContract.connect(minter_1).andMintFor(remaining, { value: costToMintRemaining });
        await trx.wait();
        
        // console.log(`>> CONTRACT HAS ${await nftContract.xGroupTotalMintsLeft()} REMAINING TO MINT!`);
        // console.log('>> TRYING FOR ONE MORE...');
        const tooLateTrx = nftContract.connect(minter_2).andMintFor(1, { value: convert.TokensToWei(ethPerMint) });
        
        // NOTE - SWAP COMMENTED LINES TO SEE CONTRACT EXCEPTION
        await expect(tooLateTrx).to.be.reverted;
        // await tooLateTrx;
      });

      it('it does not allow more NFTs to be minted than GROUP_TOTAL_MINTS_LEFT', async () => {
        const overMintQuantity = 6;
        const {
          // ethRequiredToMint,
          costToMint: costToOverMint
        } = convert.howMuchToMint({
          mintQuantity: overMintQuantity,
          ethPerMint
        });

        // console.log('>> "OVER MINTING"');
        // console.log(`>> CONTRACT HAS ${await nftContract.xGroupTotalMintsLeft()} REMAINING TO MINT!`);
        // console.log('>> OVER MINT REQUESTING: ', overMintQuantity);

        const overMintTrx = nftContract.connect(minter_1).andMintFor(overMintQuantity, { value: costToOverMint });
        
        // NOTE - SWAP COMMENTED LINES TO SEE CONTRACT EXCEPTION
        await expect(overMintTrx).to.be.reverted;
        // await overMintTrx;
      });
    });

    describe(`- will be successful if...`, () => {
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
      
      it('trx updates the total supply', async() => { 
        const totalSupplyMinted = await nftContract.totalSupply();
        // console.log('>> TOTAL SUPPLY MINTED:', totalSupplyMinted, specMintQty_0);
        expect(totalSupplyMinted).to.equal(specMintQty_0);
      });
    });
  });

  describe('\n Minting before GROUP_MINT_OPEN_DATE... \n', () => {
    const futureDate = 'May 26, 2030 18:00:00';
    const specToPreLaunchDeploymentArgs = {
      ...contractConfig,
      ...{
        _groupMintingDate: new Date(futureDate).getTime().toString().slice(0, 10) // NOTE - FUTURE DATE >> 
      }
    };

    beforeEach(async () => {
      nftContract = await generateContract({ ethers, targetContractKey, contractConfig: specToPreLaunchDeploymentArgs });
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
    const specMintQty_1 = 5;
    const targetURI = `${contractConfig._baseTokenURI}/1.json`;
    const targetTokenId = 1;
    const crazyHighTokenId = 999999;

    const {
      // ethRequiredToMint,
      costToMint: specMintCost_1
    } = convert.howMuchToMint({
      mintQuantity: specMintQty_1,
      ethPerMint
    });
   
    console.log('\n >> PREP FOR NFT ID VERIFICATION \n');
    console.table({specMintQty_1, specCostToMintInWei: specMintCost_1.toString()});

    beforeEach(async () => {
      nftContract = await generateContract({ ethers, targetContractKey, contractConfig });
      trx = await nftContract.connect(minter_1).andMintFor(specMintQty_1, {value: specMintCost_1 });
      await trx.wait();
    });

    describe(`- will be successful if...`, () => {
      it(`it returns all ${specMintQty_1} NFTs owner minted`, async() => {
        const assetCollection = await nftContract.getAssetCollectionByOwner(minter_1Address);

        // console.log('>> ASSETS:', assetCollection);
        
        expect(assetCollection.length).to.equal(specMintQty_1);
        expect(assetCollection[0].toString()).of.equal('1');
        expect(assetCollection[1].toString()).of.equal('2');
        expect(assetCollection[2].toString()).of.equal('3');
        expect(assetCollection[3].toString()).of.equal('4');
        expect(assetCollection[4].toString()).of.equal('5');
      });
            
      it(`it returns IPFS URI ${targetURI} for spec tokenId: ${targetTokenId}`, async() => {
        expect(await nftContract.getTokenURI(targetTokenId)).to.equal(targetURI);
      });
      
      it(`it returns the address of the owner for tokenId: ${targetTokenId}`, async () => {
        expect(await nftContract.ownerOf(targetTokenId)).to.equal(minter_1Address);
      });

      it(`it returns total number of tokens the minter owns: ${specMintQty_1}`, async () => {
        expect(await nftContract.balanceOf(minter_1Address)).to.equal(specMintQty_1);
      });

      it(`it rejects match of invalid tokenId: ${crazyHighTokenId} for TOKEN_URI`, async() => {
        const badURIRequest = nftContract.getTokenURI(crazyHighTokenId);
        // NOTE - SWAP COMMENTED LINES TO SEE CONTRACT EXCEPTION
        await expect(badURIRequest).to.be.reverted;
        // await badURIRequest;
      });
    });
  });
  
  // TODO -
  // TODO [] -

  // ! PROCESS MANAGEMENT
  
  // ! - PROCESS GROUP MIGRATION
  // ! - UPDATE GROUP MINTING
  // ! - UPDATE GROUP META
  
  // ! - UPDATE CONTRACT META
  // ! - PROCESS WITDRAWL OF FUNDS RAISED
});
