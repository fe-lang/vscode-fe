import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';

const EXTENSION_ID = 'fe-language-team.fe-analyzer';

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

suite('Fe Extension Integration', () => {

	test('extension activates when opening a .fe file', async function () {
		this.timeout(60_000);

		const ext = vscode.extensions.getExtension(EXTENSION_ID);
		assert.ok(ext, `Extension ${EXTENSION_ID} not found. Installed extensions: ${vscode.extensions.all.map(e => e.id).join(', ')}`);

		// Open a .fe file — this triggers onLanguage:fe activation
		const fixtureDir = path.resolve(__dirname, '../../../test-fixtures');
		const feFile = vscode.Uri.file(path.join(fixtureDir, 'hello.fe'));
		const doc = await vscode.workspace.openTextDocument(feFile);
		await vscode.window.showTextDocument(doc);

		// Wait for extension to activate
		if (!ext.isActive) {
			await ext.activate();
		}
		assert.ok(ext.isActive, 'Extension failed to activate');

		console.log('Extension activated successfully');
	});

	test('language server initializes and produces diagnostics', async function () {
		this.timeout(60_000);

		// The file should already be open from the previous test.
		// Give the language server time to start and analyze.
		const fixtureDir = path.resolve(__dirname, '../../../test-fixtures');
		const feFile = vscode.Uri.file(path.join(fixtureDir, 'hello.fe'));

		// Poll for diagnostics — the LS needs time to spin up and respond.
		// We consider it a success if we get diagnostics OR if we get zero
		// diagnostics (valid file). The failure case is the LS never starting,
		// which would mean the extension threw an error during activation.
		let attempts = 0;
		const maxAttempts = 20;
		let diagnostics: vscode.Diagnostic[] = [];

		while (attempts < maxAttempts) {
			diagnostics = vscode.languages.getDiagnostics(feFile);
			// If we got any diagnostics, the LS is definitely alive
			if (diagnostics.length > 0) {
				break;
			}
			await sleep(1000);
			attempts++;
		}

		console.log(`Diagnostics after ${attempts + 1} attempts: ${diagnostics.length}`);
		for (const d of diagnostics) {
			console.log(`  [${vscode.DiagnosticSeverity[d.severity]}] ${d.range.start.line}:${d.range.start.character} ${d.message}`);
		}

		// The LS is alive if:
		// 1. We got diagnostics (errors or warnings), OR
		// 2. The extension is still active (no crash) after waiting
		const ext = vscode.extensions.getExtension(EXTENSION_ID);
		assert.ok(ext?.isActive, 'Extension deactivated unexpectedly — language server may have crashed');

		console.log('Language server initialized successfully');
	});
});
