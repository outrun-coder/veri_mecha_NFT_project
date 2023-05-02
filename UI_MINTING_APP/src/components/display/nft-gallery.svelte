<script lang="ts">
	import { Button, Card, CardBody, Image, NavLink } from "sveltestrap";

  const demoImages = [
    {alt: 'test_1', src: '', meta: {}},
    {alt: 'test_2', src: '', meta: {}},
    {alt: 'test_3', src: '', meta: {}},
    {alt: 'test_4', src: '', meta: {}},
    {alt: 'test_5', src: '', meta: {}}
  ];
</script>

<Card class="mb-3">
  <CardBody class="text-center">
    <h2>NFT Gallery</h2>

    <div class="gallery-container">
      {#each demoImages as slide}
        <div class="nft asset-slide"></div>
      {/each}
    </div>

    <NavLink href="/mint">
      <Button>Mint a Mecha!</Button>
    </NavLink>
  </CardBody>

</Card>

<style>
  .gallery-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .asset-slide {
    width: 100px;
    height: 100px;
    margin: 10px;
    border: 1px solid rgb(232, 232, 232);
  }
</style>
