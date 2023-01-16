# Tea UI Workspace
This repository includes the tea GUI/Desktop App.

For better documentation checkout this [notion](https://www.notion.so/teaxyz/tea-gui-fdd9f50aa980432fa370b2cf6a03cb50).

# Requirements
* [tea - is all you need](https://tea.xyz/)

## Dependencies

| Project    | Version |
|------------|---------|
| nodejs.org |  >=16   |
| pnpm.io    |  >=7.18.2 |
| rust-lang.org |  >=1.64 |
| rust-lang.org/cargo |  >=0.66 |
| tea.xyz/gx/cc | >=0.1 |

## Tasks

### setup
```sh
pnpm install
```

### build
```sh
pnpm install
pnpm build:gui
```

## Development

To develop the GUI within Tauri Webview
```
$ pnpm dev:gui
```

To develop the GUI within your local browser at localhost:8080
```
$ pnpm web:gui
```

# Creating a release
Tag any commit in the main branch, then push directly to the main branch.
Lets follow the [semver](https://semver.org/) versioning standard, prefixed with `v`: ie `v1.2.3`
```
$ git tag v1.0.0
$ git push <remote> tag v1.0.0
```
We do not have a runner for building for M1 and M2, to manually deploy a release. Make sure you have a [aws-cli](https://aws.amazon.com/cli/). Configure your aws cli profile correctly.
To publish a release simply run
```
$ AWS_PROFILE=tea/or/etc pnpm release
```


Refer to each package README.md for instructions on how to setup and contribue to them:

* [tea/gui](./modules/gui/README.md)
* [tea/ui](./modules/ui/README.md)