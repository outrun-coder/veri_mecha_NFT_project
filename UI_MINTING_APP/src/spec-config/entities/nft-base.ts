class NftBaseModel {
  constructor(token: any) {
    this.tokenId = token.toString();
  }
  minted = false
  tokenId = 0
  name = 'test'
  type = 'test'
  class = 'test'
  speed = '5'
  weight = '4'
};

export default NftBaseModel;