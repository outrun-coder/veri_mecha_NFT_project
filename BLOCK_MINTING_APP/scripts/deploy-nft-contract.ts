const hre = require("hardhat");
const { ethers } = hre;

// - UTILS
import { createFigureConverterWith, processContractDeployment } from "block-project-utils";

// - CONFIG
import { targetContractKey, devConfigFactory } from '../config/deployment/nft-poc-config-factory';

const convert = createFigureConverterWith(ethers);
const nftConfig = devConfigFactory({ convert });

async function main() {
  const nftContract = await processContractDeployment({
    verbose: true,
    ethers,
    targetContractKey,
    contractConfig: nftConfig
  });
  await nftContract.deployed();

  console.log(`\n NFT CONTRACT DEPLOYED TO: ${nftContract.address}\n`)
}

main().catch((error) => {
  console.error(`(!) Error on deployment script (!)`, error);
  process.exitCode = 1;
});