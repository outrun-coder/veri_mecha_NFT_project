<script lang="ts">
  import { Card, CardBody } from "sveltestrap";

  import NftMinting from "services/nft-minting.app";
	
  import Staging from "./minting-interface/staging.svelte";

  console.log(`> SMOKE TEST NFT MINTING:`, NftMinting);
</script>

<Card>
  <CardBody>
    <Staging/>
  </CardBody>
</Card>
