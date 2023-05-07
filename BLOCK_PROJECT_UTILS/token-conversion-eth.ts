const createFigureConverterWith = (ethers: any) => {
  const { utils: {
    parseUnits,
    formatEther
  } } = ethers;

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
