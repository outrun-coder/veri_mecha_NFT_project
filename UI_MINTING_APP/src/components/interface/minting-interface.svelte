<script lang="ts">
  // import { mockNetworkDelay } from "block-project-utils"
  // return mockNetworkDelay({
  //   delay: 3000,
  //   callback: () => {
  //     console.log('>> WAITING TEST DONE >>');
  //   }
  // })
  import { Card, CardBody } from "sveltestrap";
  
  import MintsStaging from "./minting-interface/mints-staging.svelte";
  import ProcessingScreen from "components/display/processing-screen.svelte";
  import NftMinting from "services/nft-minting.app";

  // console.log(`> SMOKE TEST NFT MINTING LOADED:`, NftMinting);

  // STATE
  const { appIsWorking } = NftMinting;
</script>

<Card>
  <CardBody>
    <MintsStaging/>

    {#if $appIsWorking}
      <ProcessingScreen/>
    {/if}
  </CardBody>
</Card>
