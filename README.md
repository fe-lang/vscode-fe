# Fe for Visual Studio Code

Syntax highlighting, diagnostics, go-to-definition, and more for the [Fe](https://fe-lang.org) programming language.

## Features

- Syntax highlighting via TextMate grammar
- Diagnostics (errors and warnings) from the Fe compiler
- Go-to-definition
- Find references

## Prerequisites

The `fe` CLI (which includes the language server) must be installed:

```sh
curl -fsSL https://raw.githubusercontent.com/argotorg/fe/master/feup/feup.sh | bash
```

Or build from source:

```sh
cargo install --git https://github.com/argotorg/fe.git fe
```

The extension looks for the `fe` binary in the following order:

1. `FE_PATH` environment variable
2. `PATH`
3. `~/.cargo/bin`
4. `~/.fe/bin` (feup install location)

## Installation

Download the latest `.vsix` from the [releases page](https://github.com/fe-lang/vscode-fe/releases), then install it:

```sh
code --install-extension fe-analyzer-*.vsix
```

Or from within VS Code: open the command palette (`Ctrl+Shift+P`), run **Extensions: Install from VSIX...**, and select the downloaded file.
