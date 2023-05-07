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
  import ConnectionLanding from "./minting-interface/connection-landing.svelte";

  // console.log(`> SMOKE TEST NFT MINTING LOADED:`, NftMinting);

  // STATE
  const { appIsWorking, hasAccountConnection } = NftMinting;
</script>

<Card>
  <CardBody>
    {#if $hasAccountConnection}
      <MintsStaging/>
    {:else}
      <ConnectionLanding/>
    {/if}

    {#if $appIsWorking}
      <ProcessingScreen/>
    {/if}
  </CardBody>
</Card>
