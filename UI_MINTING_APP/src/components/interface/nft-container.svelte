<script lang="ts">
	import { Card } from "sveltestrap";

  export let tokenDetails: any;
</script>

<div class="nft-container">
  <Card>
    <div class="nft-image"></div>
  </Card>
</div>

<style>
  .nft-container {
    width: 170px;
    margin: 5px;
  }

  .nft-image {
    border: 1px solid rgb(240, 240, 240);
    height: 175px;
  }
</style>