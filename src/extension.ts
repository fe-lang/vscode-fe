import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

let client: LanguageClient;

function findInPath(name: string): string | undefined {
  const pathEnv = process.env.PATH || "";
  const sep = os.platform() === "win32" ? ";" : ":";
  for (const dir of pathEnv.split(sep)) {
    const full = path.join(dir, name);
    try {
      fs.accessSync(full, fs.constants.X_OK);
      return full;
    } catch {
      continue;
    }
  }
  return undefined;
}

function getServerPath(): string {
  const executable = os.platform() === "win32" ? "fe.exe" : "fe";

  // FE_PATH env var takes priority (consistent across all Fe editor extensions)
  const fePath = process.env.FE_PATH;
  if (fePath) {
    try {
      fs.accessSync(fePath, fs.constants.X_OK);
      return fePath;
    } catch {
      // fall through
    }
  }

  // Find in PATH
  const found = findInPath(executable);
  if (found) {
    return found;
  }

  // Check ~/.fe/bin (installed by feup)
  const feupBin = path.join(os.homedir(), ".fe", "bin", executable);
  try {
    fs.accessSync(feupBin, fs.constants.X_OK);
    return feupBin;
  } catch {
    // not there either
  }

  // Check ~/.cargo/bin (VS Code often doesn't inherit shell PATH)
  const cargoBin = path.join(os.homedir(), ".cargo", "bin", executable);
  try {
    fs.accessSync(cargoBin, fs.constants.X_OK);
    return cargoBin;
  } catch {
    // not there either
  }

  throw new Error(
    "Could not find fe. Set FE_PATH or install with: curl -L https://raw.githubusercontent.com/argotorg/fe/master/feup/feup.sh | bash",
  );
}

function registerCommands(context: vscode.ExtensionContext) {
  // Bridge: convert JSON args from the server into VS Code types
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fe.showReferences",
      async (uriStr: string, posJson: { line: number; character: number }, locsJson: { uri: string; range: { start: { line: number; character: number }; end: { line: number; character: number } } }[]) => {
        const uri = vscode.Uri.parse(uriStr);
        const pos = new vscode.Position(posJson.line, posJson.character);
        const locs = locsJson.map(
          (l) =>
            new vscode.Location(
              vscode.Uri.parse(l.uri),
              new vscode.Range(
                new vscode.Position(l.range.start.line, l.range.start.character),
                new vscode.Position(l.range.end.line, l.range.end.character),
              ),
            ),
        );
        await vscode.commands.executeCommand(
          "editor.action.showReferences",
          uri,
          pos,
          locs,
        );
      },
    ),
  );
}

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  try {
    const serverPath = getServerPath();

    const serverOptions: ServerOptions = {
      run: { command: serverPath, args: ["lsp"] },
      debug: { command: serverPath, args: ["lsp"] },
    };

    const clientOptions: LanguageClientOptions = {
      documentSelector: [{ scheme: "file", language: "fe" }],
    };

    client = new LanguageClient(
      "fe-language-server",
      "Fe Language Server",
      serverOptions,
      clientOptions,
    );

    registerCommands(context);
    await client.start();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(
      `Failed to start Fe Language Server: ${errorMessage}`,
    );
  }
}

export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}
