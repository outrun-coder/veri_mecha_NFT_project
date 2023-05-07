<script lang="ts">
	import { Button, Card, CardBody, Spinner } from "sveltestrap";
	import NftMinting from "services/nft-minting.app";
	import { delay } from "block-project-utils/mock-network-delay";

  const { appIsWorking, userOptedToConnect } = NftMinting;

  let optedIn = false;

  const activateInterface = async() => {
    await NftMinting.connectUserAccount();

    optedIn = true;

    await delay(2500);
    userOptedToConnect.set(true);
  }

  $:statusColor = (optedIn) ? 'success' : 'primary';
</script>

<Card>
  <CardBody>
    <div class="connection-landing">
      <Button
        color={statusColor}
        disabled={optedIn}
        on:click={activateInterface}>
        {#if optedIn}
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