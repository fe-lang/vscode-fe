import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Open the test-fixtures folder so the extension activates on .fe files
		const testWorkspace = path.resolve(extensionDevelopmentPath, 'test-fixtures');

		await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [
				testWorkspace,
				'--disable-gpu',          // avoid GPU flakiness in CI
			],
		});
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exit(1);
	}
}

main();
