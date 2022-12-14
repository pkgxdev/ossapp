# Tea UI Workspace
This repository includes the tea GUI/Desktop App.

For better documentation checkout this [notion](https://www.notion.so/teaxyz/tea-gui-fdd9f50aa980432fa370b2cf6a03cb50).

# Requirements
* [pnpm@^7.8](https://pnpm.io/)
* [node@^16](https://github.com/tj/n)
* [rust@^1.62](https://www.rust-lang.org/)
* [cargo@^1.62](https://crates.io/)

# Development
Setting up the workspace just run here:
```
$ pnpm install
```

To develop the GUI within Tauri Webview
```
$ pnpm dev:gui
```

To develop the GUI within your local browser at localhost:8080
```
$ pnpm web:gui
```
# Build a GUI installer
This assumes you have installed the dev dependencies
```
$ pnpm build:gui
```

# Creating a release
Tag any commit in the main branch, then push directly to the main branch.
Lets follow the [semver](https://semver.org/) versioning standard
```
$ git tag v1.0.0
```

Refer to each package README.md for instructions on how to setup and contribue to them:

* [tea/gui](./packages/gui/README.md)
* [tea/ui](./packages/ui/README.md)