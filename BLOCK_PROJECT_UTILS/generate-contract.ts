
const generateContract = async(args: any) => {
    const {
      ethers,
      targetContractKey,
      deploymentArgs
    } = args;
      const contractFactory = await ethers.getContractFactory(targetContractKey);
      const contract = await contractFactory.deploy(deploymentArgs);

      return contract;
}

export default generateContract;