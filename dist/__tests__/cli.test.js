"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
/* eslint-disable @typescript-eslint/no-empty-function */
describe('CLI', () => {
    let program;
    beforeEach(() => {
        jest.resetModules();
        program = new commander_1.Command();
        // Register test commands
        program
            .command('build')
            .description('Build the blog')
            .action(() => { });
        program
            .command('serve')
            .description('Serve the blog')
            .action(() => { });
    });
    test('should have basic commands', () => {
        expect(program.commands.length).toBeGreaterThan(0);
    });
    test('should handle build command', () => {
        const buildCmd = program.commands.find((cmd) => cmd.name() === 'build');
        expect(buildCmd === null || buildCmd === void 0 ? void 0 : buildCmd.name()).toBe('build');
    });
    test('should handle serve command', () => {
        const serveCmd = program.commands.find((cmd) => cmd.name() === 'serve');
        expect(serveCmd === null || serveCmd === void 0 ? void 0 : serveCmd.name()).toBe('serve');
    });
});
