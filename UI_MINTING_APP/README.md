### TEST TRXs
- 05/11/23 Minted 3 => 0x18f1498b050f60412332f27a853158fdf6b00e0ff263bdbef56b83d96c127819
- https://goerli.etherscan.io/tx/0x18f1498b050f60412332f27a853158fdf6b00e0ff263bdbef56b83d96c127819

# create-svelte

## issues
- using sveltestrap brings in popper.js as a broken dependency - use links below to setup a work around
  - https://github.com/sveltejs/kit/issues/2161#issuecomment-1252026388
  - https://github.com/sveltejs/kit/issues/4504#issuecomment-1135338008

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
