<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
	import { Badge, Card, CardBody } from 'sveltestrap';
	
	import NftMinting from 'services/nft-minting.app';

	const {
		nftName_,
		nftSymbol_,
		nftCost_,
		nftBaseURI_,
		nftMintOpenDate_,
		nftTotalMintsLeft_
	} = NftMinting
</script>

<div class="text-column">
	<h1>About this app</h1>

	<Card>
		<CardBody>
			<Badge color="primary">{$nftName_}</Badge>
			<Badge color="primary">{$nftSymbol_}</Badge>
			<Badge color="primary">{$nftCost_}</Badge>
			<Badge color="primary">{$nftBaseURI_}</Badge>
			<Badge color="primary">{$nftMintOpenDate_}</Badge>
			<Badge color="primary">{$nftTotalMintsLeft_}</Badge>
		</CardBody>
	</Card>

	<p>
		This is a <a href="https://kit.svelte.dev">SvelteKit</a> app. You can make your own by typing the
		following into your command line and following the prompts:
	</p>

	<pre>npm create svelte@latest</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>

	<p>
		The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
		using it with JavaScript disabled!
	</p>
</div>
