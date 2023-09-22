![pkgx.dev](https://pkgx.dev/banner.png)

`ossapp` is the graphical app complement to [`pkgx`].

Under the hood `ossapp` installs and manages your packages with [`pkgx`]
while exposing additional functionality, features and informational touches
that complement and expand upon the nature of package management.

To install `ossapp`, visit: <https://pkgx.app> and download the latest
version. `ossapp` auto-updates itself.

&nbsp;

# Contributing

If you have suggestions or ideas, start a [discussion]. If we agree, we’ll
move it to an issue. Bug fixes straight to pull request or issue please!

## Anatomy

`ossapp` is a Svelte Electron app. The electron “backend” can be found in
`electron/`, the Svelte “frontend” is in `svelte/`.

The following technologies are used:

- [svelte](https://svelte.dev/)
- [tailwind](https://tailwindcss.com/)
- [fontastic](https://fontastic.me)
- [electron](http://electronjs.org)

# Hacking on `ossapp`

```sh
xc setup  # only required once
xc build  # only required if you modify the backend
xc dev    # opens the app in dev mode
```

> Make sure to run `xc prettier` before submitting pull-requests.

&nbsp;

# i18n (Translating `ossapp`)

We’d love your help in translating the gui into different languages.
The translation related source code are all in `./svelte/src/libs/translations/*`.

To add a new language:

1. Create a json file in `./svelte/src/libs/translations/languages/[lang].json`.
   Copy the contents of `en.json` then translate.
2. Import the new language in `./svelte/src/libs/translations/index.ts`.
   More instructions are in that file.

&nbsp;

# Tasks

The following can be run with [`xc`], eg. `xc build`.

## Setup

Setup ensures that required configuration placeholder files are present and
installs dependencies.

```sh
if [ ! -e electron/config.json ]; then
  echo '{}' > electron/config.json
fi

if [ ! -e modules/desktop/.env ]; then
  cp .env.example .env
fi

npm install
npx electron-rebuild
npm run prepare
```

## Build

```sh
npm install
npm run package
```

## Build:lite

Builds only a `.app` that is not codesigned or notarized. Ideal for local testing.

```sh
export CSC_IDENTITY_AUTO_DISCOVER=false
export MAC_BUILD_TARGET=dir
export NOTARIZE=false
npm install
npm run package
```

## Dev

```sh
npm run dev
```

## Prettier

```sh
npm run format
```

## Dist

```sh
npm install
npm run predist
npm run dist
```

## Check

Runs the typescript compiler and linter.

```sh
npm run check
npm run lint
```

## e2e

Runs the webdriver.io end to end tests. Assumes that `xc build` has already been
executed.

```sh
npm run e2e
```

## Bump

Inputs: PRIORITY

```sh
if ! git diff-index --quiet HEAD --; then
  echo "error: dirty working tree" >&2
  exit 1
fi

if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
  echo "error: requires main branch" >&2
  exit 1
fi

V=$(node -p "require('./package.json').version")
V=$(tea semverator bump $V $PRIORITY)

if ! grep -F "\"version\": \"$V\",$" package.json; then
  sed -i.bak -e "s/\"version\": .*,$/\"version\": \"$V\",/" package.json
  rm package.json.bak
  git add package.json
  git commit -m "bump $V" --gpg-sign
fi

git push origin main
```

## Release

```sh
V="$(node -p "require('./package.json').version")"
tea gh release create "v$V"
```

[`pkgx`]: https://github.com/pkgxdev/pkgx
[`xc`]: https://xcfile.dev
[discussion]: https://github.com/orgs/pkgxdev/discussions
