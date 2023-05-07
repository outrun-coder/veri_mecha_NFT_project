
const generateContract = async(args: any) => {
  const {
    verbose,
    ethers,
    targetContractKey,
    contractConfig
  } = args;

  if (verbose) {
    console.log(`>> DEPLOY CONTRACT: ${targetContractKey} \n with configuration:`);
    console.table(contractConfig);
  }

  const contractFactory = await ethers.getContractFactory(targetContractKey);
  const contract = await contractFactory.deploy(contractConfig);

  return contract;
}

export default generateContract;