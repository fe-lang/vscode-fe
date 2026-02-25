# Fe Language VSCode Extension

## Installation

### Prerequisites

**`fe` CLI** (includes the language server) must be installed and available in your PATH:

```sh
curl -fsSL https://raw.githubusercontent.com/argotorg/fe/master/feup/feup.sh | bash
```

Or build from source:

```sh
cargo install --git https://github.com/argotorg/fe.git fe
```

### VSCode Extension

Download the latest `.vsix` from the [releases page](https://github.com/fe-lang/vscode-fe/releases), then install it:

```sh
code --install-extension fe-analyzer-0.0.1.vsix
```

Or install from within VSCode: open the command palette (`Ctrl+Shift+P`), run **Extensions: Install from VSIX...**, and select the downloaded file.

## Development/Debugging

Open the Fe codebase root workspace in VSCode and press `F5` to debug the extension using the "Launch Fe VSCode Extension" configuration.

## Building releases

Releases are built automatically via GitHub Actions. Push a version tag to trigger a release:

```sh
git tag v0.0.1
git push origin v0.0.1
```

This packages the extension as a `.vsix` and attaches it to a GitHub Release.
