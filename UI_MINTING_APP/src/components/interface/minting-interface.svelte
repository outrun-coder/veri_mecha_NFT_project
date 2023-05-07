<script lang="ts">
  // import { mockNetworkDelay } from "block-project-utils"
  // return mockNetworkDelay({
  //   delay: 3000,
  //   callback: () => {
  //     console.log('>> WAITING TEST DONE >>');
  //   }
  // })
  import { Card, CardBody } from "sveltestrap";
  
  import Staging from "./minting-interface/staging.svelte";
  import ProcessingScreen from "components/display/processing-screen.svelte";
  import NftMinting from "services/nft-minting.app";

  // console.log(`> SMOKE TEST NFT MINTING LOADED:`, NftMinting);

  // STATE
  // let displaySuccessfulMints: boolean = true;

  const { appIsWorking } = NftMinting;

  // ACTIONS
  const handleMintingWith = async(requestedCount: number) => {
    const result = await NftMinting.processMintsBy(requestedCount);

    console.log('>> INTERFACE RECEIVED RESULT: \n', result);

    if (result.success) {
      // OK & open interface
      await NftMinting.setTotalMintsLeft();
      // proceed to success & display stage
    } else {
      // FAIL HANDLE AND TRY AGAIN
      // open
      return result;
    }
  };  
</script>

<Card>
  <CardBody>
    <Staging
      handleMintingWith={handleMintingWith}/>

    {#if $appIsWorking}
      <ProcessingScreen/>
    {/if}
  </CardBody>
</Card>
