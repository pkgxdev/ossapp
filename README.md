![tea](https://tea.xyz/banner.png)

<p align="center">
  <a href="https://twitter.com/teaxyz">
    <img src="https://img.shields.io/badge/-teaxyz-2675f5?logo=twitter&logoColor=fff" alt="Twitter" />
  </a>
  <a href="https://discord.gg/JKzuqrW9">
    <img src="https://img.shields.io/discord/906608167901876256?label=discord&color=29f746" alt="Discord" />
  </a>
  <a href="https://docs.tea.xyz">
    <img src="https://img.shields.io/badge/-docs-2675f5?logoColor=fff&color=ff00ff&logo=gitbook" alt="Documentation & Manual" />
  </a>
</p>

tea/gui is the graphical app complement to [`tea/cli`].

Under the hood tea/gui installs and manages your packages with [`tea/cli`]
while exposing additional functionality, features and informational touches
that complement and expand upon the nature of package management.

To install the gui, visit: https://tea.xyz/gui/ and download the latest
version. The gui auto-updates itself.

![screenshot](https://user-images.githubusercontent.com/58962/235918362-48efad34-8f7b-4420-81db-abfa0d7cafe7.jpg)

&nbsp;


# Contributing to `tea/gui`

If you have suggestions or ideas, start a [discussion]. If we agree, we’ll
move it to an issue. Bug fixes straight to pull request or issue please!

## Anatomy

tea/gui is a Svelte Electon app. The electron “backend” can be found in
`modules/desktop`, the Svelte “frontend” in `modules/ui`. The following
technologies are used:

- [svelte](https://svelte.dev/)
- [tailwind](https://tailwindcss.com/)
- [fontastic](https://fontastic.me)
- [electron](http://electronjs.org)


# Hacking on `tea/gui`

```sh
xc setup  # only required once
xc build  # only required if you modify the backend
xc dev    # opens the app in dev mode
```

> Make sure to run `xc prettier` before submitting pull-requests.

&nbsp;


# Tasks

The following can be run with [`xc`], eg. `xc build`.

## Setup

Setup ensures that required configuration placeholder files are present and installs dependencies.

```sh
if [ ! -e modules/desktop/electron/config.json ]; then
  echo '{}' > modules/desktop/electron/config.json
fi

if [ ! -e modules/desktop/.env ]; then
  cp modules/desktop/.env.example modules/desktop/.env
fi

pnpm install
pnpm run -r prepare
```

## Build

```sh
pnpm install
pnpm build:desktop
```

## Dev

```sh
pnpm install
pnpm dev
```

## Prettier

```sh
pnpm run --reporter append-only -r format
```

## Dist

```sh
pnpm install
pnpm --filter tea exec pnpm predist
pnpm --filter tea exec pnpm dist
```

## Check
Runs the typescript compiler and linter.

```sh
pnpm run -r check
pnpm run -r lint
```

&nbsp;


# Dependencies

[`tea/cli`] will automagically make these available to your environment.

| Project                           |  Version  |
|-----------------------------------|-----------|
| nodejs.org                        | =18.15.0  |
| pnpm.io                           | =7.18.2   |
| xcfile.dev                        | >=0.0.110 |
| python.org                        | ^3.10     |

[`tea/cli`]: https://github.com/teaxyz/cli
[`xc`]: https://xcfile.dev
[discussion]: https://github.com/orgs/teaxyz/discussions
