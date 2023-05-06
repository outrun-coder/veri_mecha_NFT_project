<script lang="ts">
  import { Card, CardBody } from "sveltestrap";
  import { mockNetworkDelay } from "block-project-utils"

  import NftMinting from "services/nft-minting.app";
	
  import Staging from "./minting-interface/staging.svelte";

  console.log(`> SMOKE TEST NFT MINTING:`, NftMinting);

  const handleMintingWith = async(mintCount: number) => {
    console.log('>> HANDLE_MINTING WAS INVOKED:', mintCount);

    console.log('>> WILL MINT...');
    return mockNetworkDelay({
      delay: 3000,
      callback: () => {
        console.log('>> TEST DONE >>');
      }
    })
  };  
</script>

<Card>
  <CardBody>
    <Staging
    handleMintingWith={handleMintingWith}/>
  </CardBody>
</Card>
