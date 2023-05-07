const createFigureConverterWith = (ethers: any) => {
  let
  parseUnits: any, // func
  formatEther: any; // func

  if (ethers.utils) {
    // v5
    parseUnits = ethers.utils.parseUnits;
    formatEther = ethers.utils.formatEther;
  } else {
    // v6 no util level
    parseUnits = ethers.parseUnits;
    formatEther = ethers.formatEther;
  }

  const TokensToWei = (amount: any) => { // number || string
    // 1 => 1000000000000000000
    return parseUnits(amount.toString(), 'ether');
  }

  const WeiToTokens = (bigNumber: any) => { // bnObject
    // 1000000000000000000 => 1
    return formatEther(bigNumber);
  }

  const toCostByNumberOfMints = (args: any) => {
    const { numberOfMints, ethPerMint } = args;
  
    const ethRequiredToMint = numberOfMints * ethPerMint;
    const costToMint = TokensToWei(ethRequiredToMint);
  
    return {
      ethRequiredToMint,
      costToMint
    }
  };

  return {
    TokensToWei,
    WeiToTokens,
    toCostByNumberOfMints
  }
};

export default createFigureConverterWith;
