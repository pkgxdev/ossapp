# @tea/desktop

Desktop app of [tea](https://tea.xyz) for installing packages/softwares

More interesting and possibly updated documentations are at this [NOTION](https://www.notion.so/teaxyz/tea-gui-fdd9f50aa980432fa370b2cf6a03cb50) page. It is ideal to review it also, its more updated.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
# use if you need interaction with the rust handlers
pnpm tauri dev

# or if ui dev only
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Testing

```bash
pnpm playwright install
pnpm test

```

## Intuition Building Links

- [Rust module system is weird?](https://www.sheshbabu.com/posts/rust-module-system/)

<p align="center">
  <img src="https://github.com/Dax89/electron-sveltekit/blob/master/icon.png" width="256">
</p>
<p align="center">
  A minimal project template for Electron and SvelteKit configured with <a href="https://www.npmjs.com/package/@sveltejs/adapter-static">adapter-static</a>.
</p>

## Screenshot

![Screenshot](https://github.com/Dax89/electron-sveltekit/blob/master/screenshot.png)

## Commands

- `pnpm dev`: Runs SvelteKit in dev mode
- `pnpm preview`: Runs SvelteKit in production mode
- `pnpm electron`: Runs SvelteKit with electron in dev mode
- `pnpm build`: Runs SvelteKit compiler
- `pnpm dev:package`: Creates an Electron package (you can inspect the contents)
- `pnpm package`: Creates a distributable Electron package
