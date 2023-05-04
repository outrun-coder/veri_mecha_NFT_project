import { networkConfigs } from "../spec-config"

class NftMintingApp {

  store: any
  contract: any
  user: any

  constructor() {
    // initialization here <<<
    // TODO [] - STORE FOR RECORD MANAGEMENT
    // TODO [] - ETHERS CONNECTION
    // [] - USER
    // [] - CONTRACT
    this.store = "TEST_STORE"
    this.contract = networkConfigs[31337].nft_VM.address;
    this.user = "TEST_USER"
  }
}

const NftMinting = new NftMintingApp();

export default NftMinting;
