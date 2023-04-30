export const targetContractKey = 'NFT_POC';
export const ethPerMint = 0.5; // RESEARCH - RELATIVE PROJECT MINTING COSTS

const createProjectConfigurationWith = (convert: any) => {
  const BASE_DEPLOYMENT_PROPS = {
    _name: 'Veri-Mecha',
    _symbol: 'VMECH',
    _baseCost: convert.TokensToWei(ethPerMint),
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
  
  const contractConfig = {
    ...BASE_DEPLOYMENT_PROPS,
    ...FIRST_SEASON_CONFIG
  }

  return contractConfig;
};

export default createProjectConfigurationWith;