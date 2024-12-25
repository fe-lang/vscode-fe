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

function verifyPath(filepath: string): string | undefined {
  try {
    fs.accessSync(filepath);
    return filepath;
  } catch {
    return undefined;
  }
}

function getServerPath(): string {
  // Check configuration first
  const config = vscode.workspace.getConfiguration("fe-analyzer");
  const customPath = config.get<string>("binaryPath");
  if (customPath && verifyPath(customPath)) {
    return customPath;
  }

  // Development path
  if (process.env.NODE_ENV === "development") {
    const devPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "target",
      "debug",
      "fe-language-server",
    );
    const verifiedDevPath = verifyPath(devPath);
    if (verifiedDevPath) {
      return verifiedDevPath;
    }
  }

  // Production paths
  const platform = os.platform();
  const binariesDir = path.join(__dirname, "..", "server");
  const executable =
    platform === "win32" ? "fe-language-server.exe" : "fe-language-server";

  // Explicitly type the platform paths
  const platformPaths: Record<string, string> = {
    win32: path.join(binariesDir, "windows", executable),
    darwin: path.join(binariesDir, "mac", executable),
    linux: path.join(binariesDir, "x86_64-unknown-linux-gnu", executable),
  };

  const platformPath = platformPaths[platform];
  if (platformPath) {
    const verifiedPlatformPath = verifyPath(platformPath);
    if (verifiedPlatformPath) {
      return verifiedPlatformPath;
    }
  }

  // Fallback to PATH lookup
  const pathEnv = process.env.PATH || "";
  const pathSeparator = platform === "win32" ? ";" : ":";
  const paths = pathEnv.split(pathSeparator);

  for (const p of paths) {
    const fullPath = path.join(p, executable);
    if (verifyPath(fullPath)) {
      return fullPath;
    }
  }

  throw new Error("Could not find fe-language-server executable");
}

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  try {
    const serverPath = getServerPath();

    const serverOptions: ServerOptions = {
      run: { command: serverPath },
      debug: { command: serverPath },
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
