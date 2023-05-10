<script lang="ts">
	import NftMinting from "services/nft-minting.app";
	import NftBaseModel from "../../spec-config/entities/nft-base";
	import { Button, Card, CardBody, NavLink } from "sveltestrap";
	import ConnectionLanding from "components/interface/minting-interface/connection-landing.svelte";
	import ProcessingScreen from "./processing-screen.svelte";
	import NftContainer from "components/interface/nft-container.svelte";

  const {
    userCollection_,
    userOptedToConnect,
    appIsWorking,
    mintGroupIsExhausted
  } = NftMinting;

  let mechs: Array<any>;

  userCollection_.subscribe((list) => {
    const available = list.map((token) => new NftBaseModel(token))
    // @ts-ignore
    mechs = (available[0] === 0) ? [] : available; 
  });
</script>

<Card class="mb-3">
  <CardBody class="text-center">
    {#if $userOptedToConnect}
      <h2>NFT Gallery</h2>

      <div class="gallery-container">
        {#each mechs as mech}
          <NftContainer tokenDetails={mech}/>
        {/each}
      </div>

      {#if !$mintGroupIsExhausted}
        <NavLink href="/mint">
          <Button>Mint a Mecha!</Button>
        </NavLink>
      {/if}
    {:else}
      <ConnectionLanding/>
    {/if}

    {#if $appIsWorking}
      <ProcessingScreen/>
    {/if}
  </CardBody>
</Card>

<style>
  .gallery-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }
</style>
