const createConverterWith = (ethers: any) => {
  const { utils: {
    parseUnits,
    formatEther
  } } = ethers;

  return {
    TokensToWei: (amount: any) => { // number || string
      // 1 => 1000000000000000000
      return parseUnits(amount.toString(), 'ether');
    },

    WeiToTokens: (bigNumber: any) => { // bnObject
      // 1000000000000000000 => 1
      return formatEther(bigNumber);
    }
  }
};

export default createConverterWith;
