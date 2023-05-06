
const generateContract = async(args: any) => {
  const {
    ethers,
    targetContractKey,
    contractConfig
  } = args;

  console.log(`>> DEPLOY CONTRACT: ${targetContractKey} \n with configuration:`);
  console.table(contractConfig);

  const contractFactory = await ethers.getContractFactory(targetContractKey);
  const contract = await contractFactory.deploy(contractConfig);

  return contract;
}

export default generateContract;