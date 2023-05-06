<script lang="ts">
	import { Button } from "sveltestrap";

  export const addMintSlot = (e: any) => {
    console.log('>> ADD SLOT WAS INVOKED:', e);
  };
  export const mintX = (e: any) => {
    console.log('>> HANDLE WAS INVOKED:', e);
  };
</script>

<Button on:click={addMintSlot}>+</Button>
  <h2>Mint the Mecha!</h2>
<Button on:click={mintX}>Mint Mecha</Button>

<style></style>
