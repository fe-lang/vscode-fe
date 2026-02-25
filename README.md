# Fe Language VSCode Extension

## Installation

### Fe CLI

The `fe` CLI (which includes the language server) must be installed and available in your PATH:

```sh
curl -fsSL https://raw.githubusercontent.com/argotorg/fe/master/feup/feup.sh | bash
```

Or build from source:

```sh
cargo install --git https://github.com/argotorg/fe.git fe
```

## Development/Debugging

Open the Fe codebase root workspace in VSCode and press `F5` to debug the extension using the "Launch Fe VSCode Extension" configuration.

## Building releases

Releases are built automatically via GitHub Actions. Push a version tag to trigger a release:

```sh
git tag v0.0.1
git push origin v0.0.1
```

This packages the extension as a `.vsix` and attaches it to a GitHub Release.
