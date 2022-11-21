# @tea/gui
Desktop app of [tea](https://tea.xyz) for installing packages/softwares

More interesting and possibly updated documentations are at this [NOTION](https://www.notion.so/teaxyz/tea-gui-fdd9f50aa980432fa370b2cf6a03cb50) page. It is ideal to review it also, probably its more updated. 

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

## Intuition Building Links

* [Rust module system is weird?](https://www.sheshbabu.com/posts/rust-module-system/)
