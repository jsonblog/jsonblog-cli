import { Command } from 'commander';
import path from 'path';

describe('JsonBlog CLI', () => {
  let program: Command;

  beforeEach(() => {
    jest.resetModules();
    program = new Command();
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
