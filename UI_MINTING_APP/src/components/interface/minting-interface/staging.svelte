<script lang="ts">
	import { Alert, Badge, Button, Card, CardBody, CardFooter, CardHeader, Spinner } from "sveltestrap";

	import NftBaseModel from "../../../spec-config/entities/nft-base";
	import NftContainer from "../nft-container.svelte";
	import NftMinting from "services/nft-minting.app";
  const { nftTotalMintsLeft_ } = NftMinting;

  export let handleMintingWith: any; // func

  // STATE
  let toBeMinted: Array<any> = [new NftBaseModel];
  $:mintsAreAvailable = (toBeMinted.length < $nftTotalMintsLeft_);

  let hasError = false;
  let trxError: any;

  const { appIsWorking } = NftMinting;

  // ACTIONS
  const resetErrors = () => {
    hasError = false;
    trxError = null;
  };

  const addToBeMinted = () => {
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

  const removeLastToBeMinted = () => {
    toBeMinted.pop();
    toBeMinted = toBeMinted;
  };

  const mintX = async() => {
    resetErrors();

    const count = toBeMinted.length;
    const result = await handleMintingWith(count);

    if (!result.success) {
      hasError = true;
      trxError = result.error;
    }
    // SUCCESS OF MINT -> SHOULD DESTROY THIS COMPONENT
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
      disabled={$appIsWorking}>
        {#if $appIsWorking}
          Processing... <Spinner color="light" size="sm"/>
        {:else}
          Mint Mecha
        {/if}
    </Button>
  </CardBody>

  <CardFooter>
    <Alert
      color="danger"
      isOpen={hasError}
      toggle={resetErrors}>
        {#if trxError}
          {trxError.code} - {trxError.info.error.message}
        {/if}
    </Alert>
  </CardFooter>
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
