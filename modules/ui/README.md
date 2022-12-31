# @tea/ui

Isolated set of UI elements/components that can be reused across all svelte related apps of tea. Components here have to be maintained as much as possible as a [dumb/presentational components](https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43).

## Developing

```bash
$ pnpm install # assuming you have not done so

# this will open your browser and show a library of UI elements
$ pnpm dev
```

### How to update icons

1. update fontastic.me tea-icons, you would probably need tom's credentials
2. run `pnpm update-icons`
3. stage and commit the changes

## Todo

[] setup a scaffolding script to make it easier making elements

## Design System

This library is dependent on the following

- [svelte](https://svelte.dev/)
- [tailwind](https://tailwindcss.com/)
- [fontastic](https://fontastic.me)
