<script lang="ts">
	import { Card } from "sveltestrap";

  export let tokenDetails: any;
  export let toggleAction: any = null;

  if(tokenDetails.tokenId === '1') {
    console.log('>> TOKEN_DETAILS:', tokenDetails);
  }
  
  const { tokenId } = tokenDetails;
</script>

<div class="nft-container">
  <Card>
    {#if !toggleAction}
      <div class="nft-image">
        <img
          alt=""
          src="https://ipfs.io/ipfs/Qmd6rTvU5bSNPBfxwriuD3amCbs653tSo19pPvkUdQRBRy/{tokenId}.png"/>
      </div>
    {:else}
      <button on:click={toggleAction(tokenId)}>
        <div class="nft-image">
          <img
            alt=""
            src="https://ipfs.io/ipfs/Qmd6rTvU5bSNPBfxwriuD3amCbs653tSo19pPvkUdQRBRy/{tokenId}.png"/>
        </div>
      </button>
    {/if}
  </Card>
</div>

<style>
  .nft-container {
    width: 180px;
    margin: 5px;
  }

  .nft-image {
    border: 1px solid rgb(240, 240, 240);
    height: 180px;
  }

  .nft-image img {
    width: 100%;
    height: 100%;
  }
</style>