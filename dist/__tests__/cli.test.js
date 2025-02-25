"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
describe('JsonBlog CLI', () => {
    let program;
    beforeEach(() => {
        jest.resetModules();
        program = new commander_1.Command();
    });
    test('should have basic commands', () => {
        expect(program.commands.length).toBeGreaterThan(0);
    });
    test('should handle generate command', () => {
        const generateCmd = program.command('generate');
        expect(generateCmd.name()).toBe('generate');
    });
    test('should handle watch command', () => {
        const watchCmd = program.command('watch');
        expect(watchCmd.name()).toBe('watch');
    });
});
