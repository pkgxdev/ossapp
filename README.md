![tea](https://tea.xyz/banner.png)

<p align="center">
  <a href="https://twitter.com/teaxyz">
    <img src="https://img.shields.io/twitter/follow/teaxyz?style=flat&label=%40teaxyz&logo=twitter&color=2675f5&logoColor=fff" alt="Twitter" />
  </a>
  <a href="https://discord.gg/JKzuqrW9">
    <img src="https://img.shields.io/discord/906608167901876256?label=discord&color=29f746" alt="Discord" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/v/release/teaxyz/cli?label=tea/cli&color=ff00ff" alt="Version" />
  </a>
</p>

This repository contains tea/gui \[[notion]\].


# Developing tea/gui

To develop within an electron view:

```
$ pnpm dev:desktop
```

To develop in your local browser:

```
$ pnpm web:desktop
$ open localhost:8080
```


# Releasing tea/gui

Tag any commit in the main branch, then push directly to the main branch.
Lets follow the [semver] versioning standard, prefixed with `v`:

```
$ git tag v1.0.0
$ git push <remote> tag v1.0.0
```

We do not have a runner for building for M1 and M2, to manually deploy a
release. Make sure you have [aws/cli] configured correctly.

To publish a release:

```
$ AWS_PROFILE=tea/or/etc pnpm release
```

Refer to each package `README.md` for instructions on how to setup and
contribute to them:

* [tea/desktop](./modules/desktop/README.md)
* [tea/ui](./modules/ui/README.md)

&nbsp;



# Tasks

The following can be run with [`xc`], eg. `xc build`

## Setup

```sh
pnpm install
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

## Dist

```sh
pnpm install
pnpm --filter desktop exec pnpm predist
pnpm --filter desktop exec pnpm dist
```

# Dependencies

| Project                           |  Version  |
|-----------------------------------|-----------|
| nodejs.org                        | =18.13.0  |
| pnpm.io                           | >=7.27    |
| xcfile.dev                        | >=0.0.110 |
| python.org                        | >=3.10    |


[aws/cli]: https://aws.amazon.com/cli/
[`xc`]: https://xcfile.dev
[semver]: https://semver.org
[notion]: https://www.notion.so/teaxyz/tea-gui-fdd9f50aa980432fa370b2cf6a03cb50
