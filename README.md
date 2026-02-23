# Fe Language VSCode Extension

## Development/Debugging
First build and install `fe`:

```sh
cargo install --git https://github.com/ethereum/fe.git fe
```

Then, open the Fe codebase root workspace in VSCode and press `F5` to debug the extension using the "Launch Fe VSCode Extension" configuration.

## Building releases

Releases are built automatically via GitHub Actions. Push a version tag to trigger a release:

```sh
git tag v0.0.1
git push origin v0.0.1
```

This packages the extension as a `.vsix` and attaches it to a GitHub Release.
