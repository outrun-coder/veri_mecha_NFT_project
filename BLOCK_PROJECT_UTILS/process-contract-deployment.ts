
const generateContract = async(args: any) => {
    const {
      ethers,
      targetContractKey,
      contractConfig
    } = args;
      const contractFactory = await ethers.getContractFactory(targetContractKey);
      const contract = await contractFactory.deploy(contractConfig);

      return contract;
}

export default generateContract;