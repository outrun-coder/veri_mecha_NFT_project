<script lang="ts">
	import { Button, Card, CardBody, Spinner } from "sveltestrap";
	import NftMinting from "services/nft-minting.app";
	import { delay } from "block-project-utils/mock-network-delay";

  let phConfirmation = false;
  const { appIsWorking } = NftMinting;

  const activateInterface = async() => {
    await NftMinting.connectUserAccount();

    // todo - Confirmation message and swithch
    phConfirmation = true;

    // fix - temp
    await delay(2500);
    NftMinting.hasAccountConnection.set(true);
  }

  $:statusColor = (phConfirmation) ? 'success' : 'primary';
</script>

<Card>
  <CardBody>
    <div class="connection-landing">
      <Button
        color={statusColor}
        on:click={activateInterface}>
        {#if phConfirmation}
          Pilot Connected!
        {:else if $appIsWorking}
          Connecting... <Spinner size="sm" color="light"/>
        {:else}
          Connect Pilot Data
        {/if}
      </Button>
    </div>
  </CardBody>
</Card>

<style>
  .connection-landing {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>