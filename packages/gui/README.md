# @tea/gui
Desktop app of [tea](https://tea.xyz) for installing packages/softwares

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm tauri dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Intuition Building Links

* [Rust module system is weird?](https://www.sheshbabu.com/posts/rust-module-system/)