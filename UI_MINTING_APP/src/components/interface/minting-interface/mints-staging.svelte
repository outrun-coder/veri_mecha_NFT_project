<script lang="ts">
	import { Alert, Badge, Button, Card, CardBody, CardFooter, CardHeader, NavLink, Spinner } from "sveltestrap";

	import NftBaseModel from "../../../spec-config/entities/nft-base";
	import NftContainer from "../nft-container.svelte";
	import NftMinting from "services/nft-minting.app";
  const { nftTotalMintsLeft_ } = NftMinting;

  // STATE
  let toBeMinted: Array<any> = [new NftBaseModel(0)];
  $:mintsAreAvailable = (toBeMinted.length < $nftTotalMintsLeft_);

  let hasError = false;
  let trxError: any;

  let mintIsSuccessful = false;
  let trxHash: string;

  const { appIsWorking, mintGroupIsExhausted, reloadTokenCollection } = NftMinting;

  // ACTIONS
  const resetStaging = async(args: any={startOver: false}) => {
    await NftMinting.setTotalMintsLeft();
    const { startOver } = args;
    hasError = false;
    trxError = null;
    mintIsSuccessful = false;

    if (startOver) {
      toBeMinted = [new NftBaseModel(0)];
      trxHash = '';
    }
  };

  const addToBeMinted = () => {
    resetStaging();
    console.log('> CHECK: toBeMinted:', toBeMinted.length);
    console.log('> CHECK: mintsAreAvailable:', mintsAreAvailable, $nftTotalMintsLeft_);
    if (mintsAreAvailable) {
      // ADD ONE
      toBeMinted = [...toBeMinted, new NftBaseModel(0)];
      console.log('>> TO_MINT_STAGE:', toBeMinted);
    } else {
      // NO MORE
      console.warn(`Mint cap reached! - only ${$nftTotalMintsLeft_} are available.`);
    }
  };

  const removeLastToBeMinted = () => {
    resetStaging();
    toBeMinted.pop();
    toBeMinted = toBeMinted;
  };

  const mintX = async() => {
    resetStaging();

    const count = toBeMinted.length;
    const result = await NftMinting.processMintsBy(count);
    console.log('>> INTERFACE RECEIVED RESULT: \n', result);

    if (!result.success) {
      // FAIL
      hasError = true;
      trxError = result.error;
    } else {
      // OK
      await NftMinting.setTotalMintsLeft();
      trxHash = result.data.trx.hash;
      mintIsSuccessful = true;
    }
  };  
</script>

<Card>
  <CardHeader>
    {#if !$mintGroupIsExhausted}
      <div class="mint-stage-controls top">
        <div>
          {#if mintIsSuccessful}
          <!-- needs restart -->
            <Button
              color="success"
              on:click={() => {resetStaging({startOver: true})}}>
                RESTART
            </Button>
          {:else}
            <!-- in progress -->
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
          {/if}
        </div>

        <Badge pill color="primary">Left to mint: {$nftTotalMintsLeft_}</Badge>
      </div>
    {/if}
  </CardHeader>

  <CardBody>
    {#if $mintGroupIsExhausted}
      <div class="mint-group-closed status-display">
        <span>All Mechs have been deployed!</span>
        <NavLink href="/garage-gallery">
          <Button on:click={reloadTokenCollection}>Report to the hanger!</Button>
        </NavLink>
        </div>
    {:else if mintIsSuccessful}
      <div class="mint-confirmation status-display">
        <NavLink href="/garage-gallery">
          <Button on:click={reloadTokenCollection}>Report to the hanger!</Button>
        </NavLink>
        <span>or RESTART</span>
      </div>
    {:else}
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
    {/if}
  </CardBody>

  <CardFooter>
    <Alert
      color="danger"
      isOpen={hasError}
      toggle={resetStaging}>
        {#if trxError}
          {trxError.code} - {trxError.info.error.message}
        {/if}
    </Alert>

    <Alert
      color="success"
      isOpen={mintIsSuccessful}>
        <span>Success: {trxHash}</span>
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

  .status-display {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
