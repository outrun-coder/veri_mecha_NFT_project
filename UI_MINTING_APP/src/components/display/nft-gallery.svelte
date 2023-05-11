<script lang="ts">
	import NftMinting from "services/nft-minting.app";
	import NftBaseModel from "../../spec-config/entities/nft-base";
	import { Badge, Button, Card, CardBody, Modal, ModalBody, ModalHeader, NavLink } from "sveltestrap";
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

  let isOpen = false;
  let targetAssetId:string = '0';
  const toggle = (_targetAssetId: string) => {
    targetAssetId = _targetAssetId;
    isOpen = !isOpen;
  };
</script>

<Card class="mb-3">
  <CardBody class="text-center">
    {#if $userOptedToConnect}
      <h2>
        Has <Badge pill>{mechs.length}</Badge> Mech{(mechs.length > 1) ? 's': ''}
      </h2>

      <div class="gallery-container">
        {#each mechs as mech}
          <NftContainer
            tokenDetails={mech}
            toggleAction={toggle}/>
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

<Modal
  {isOpen}
  {toggle}
  size="xl">
    <ModalHeader {toggle}>Veri-Mech #{targetAssetId}</ModalHeader>
    <ModalBody>
      <div class="high-res-preview">
        <img
          alt=""
          src="{`S0_veri-mechs_POC_high_res/${targetAssetId}.png`}"/>
        <div class="asset-details">
          <h2>Asset Details go here</h2>

          <div class="inspection-controls">
            <Button color="primary">Activate Mech!</Button>
            <Button color="danger">Repair</Button>
            <Button color="warning">Garage</Button>
          </div>
        </div>
      </div>
    </ModalBody>
</Modal>

<style>
  .inspection-controls {
    display: flex;
    flex-direction: column;
  }

  .gallery-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  .high-res-preview {
    display: flex;
  }

  .high-res-preview img {
    width: 75%;
  }

  .asset-details {
    padding: 20px;
  }
</style>
