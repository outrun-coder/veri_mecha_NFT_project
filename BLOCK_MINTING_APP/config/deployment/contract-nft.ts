export const targetContractKey = 'NFT_POC';
export const ethPerMint = 0.005; // RESEARCH - RELATIVE PROJECT MINTING COSTS

// TEST SPEC ONLY
export const overMintQuantity = 48;

const createNFTcontractConfigWith = (convert: any) => {
  const BASE_DEPLOYMENT_PROPS = {
    _name: 'Veri-Mecha',
    _symbol: 'VMECH',
    _baseCost: convert.TokensToWei(ethPerMint),
    //
    // _baseTokenStagedURI: '',
    // _baseTokenPendingURI: '',
    _baseTokenURI: 'QmNQ5JmdAjFBCkjrjw2F9Z1PZ94aCAPHQ4HH7mmqRAM8QM'
  };
  
  const FIRST_SEASON_CONFIG = {
    // _groupId: '0000',
    _groupMintingDate: (Date.now()).toString().slice(0, 10), // now
    _groupTotalMintsLeft: 45
  }
  
  const nftConfig = {
    ...BASE_DEPLOYMENT_PROPS,
    ...FIRST_SEASON_CONFIG
  }

  return nftConfig;
};

export default createNFTcontractConfigWith;