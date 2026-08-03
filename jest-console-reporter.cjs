/**
 * Minimal Jest reporter that prints the console output (console.log / warn /
 * error etc.) captured from each test file, without emitting any per-test
 * pass/fail lines. Use together with `jest-silent-reporter` so that passing
 * tests stay quiet while your own `console.log`s are still shown.
 */
class ConsoleReporter {
    onTestResult(_test, testResult) {
        const entries = testResult.console;
        if (!entries || entries.length === 0) { return; }

        for (const { message } of entries) {
            process.stdout.write(message + '\n');
        }
    }
}

module.exports = ConsoleReporter;
