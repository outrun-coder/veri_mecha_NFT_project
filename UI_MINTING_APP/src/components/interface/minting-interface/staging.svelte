<script lang="ts">
	import { Badge, Button, Card, CardBody, CardHeader, Spinner } from "sveltestrap";
	import NftContainer from "../nft-container.svelte";
	import NftBaseModel from "../../../spec-config/entities/nft-base";
	import NftMinting from "services/nft-minting.app";
  const { nftTotalMintsLeft_ } = NftMinting;

  export let handleMintingWith: any; // func

  // state
  let isProcessing: boolean = false;
  let toBeMinted: Array<any> = [new NftBaseModel];
  $:mintsAreAvailable = (toBeMinted.length < $nftTotalMintsLeft_);

  export const addToBeMinted = () => {
    // console.log('> CHECK: toBeMinted:', toBeMinted.length);
    // console.log('> CHECK: mintsAreAvailable:', mintsAreAvailable, $nftTotalMintsLeft_);
    if (mintsAreAvailable) {
      // ADD ONE
      toBeMinted = [...toBeMinted, new NftBaseModel];
      // console.log('>> TO_MINT_STAGE:', toBeMinted);
    } else {
      // NO MORE
      console.warn(`Mint cap reached! - only ${$nftTotalMintsLeft_} are available.`);
    }
  };

  export const removeLastToBeMinted = () => {
    toBeMinted.pop();
    toBeMinted = toBeMinted;
  };

  export const mintX = async() => {
    isProcessing = true;

    const count = toBeMinted.length;
    await handleMintingWith(count);

    isProcessing = false;
  };  
</script>

<Card>
  <CardHeader>
    <div class="mint-stage-controls top">
      <div>
        <Button
          on:click={addToBeMinted}
          disabled={!mintsAreAvailable}>
          {#if mintsAreAvailable}
            Add to Mint
          {:else}
            Limit Reached
          {/if}
        </Button>
        {#if (toBeMinted.length > 1)}
          <Button
            color="danger"
            on:click={removeLastToBeMinted}>
              Remove Last
          </Button>
        {/if}
      </div>

      <Badge pill color="primary">Left to mint: {$nftTotalMintsLeft_}</Badge>
    </div>
  </CardHeader>
  <CardBody>

    <div class="staging-list">
      {#each toBeMinted as PH}
        <NftContainer tokenDetails={PH}/>
      {/each}
    </div>

    <Button
      on:click={mintX}
      disabled={isProcessing}>
        {#if isProcessing}
          Processing... <Spinner color="light" size="sm"/>
        {:else}
          Mint Mecha
        {/if}
    </Button>
  </CardBody>
</Card>

<style>
  .mint-stage-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .staging-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }  
</style>
