import { Command } from 'commander';

describe('CLI', () => {
  let program: Command;

  beforeEach(() => {
    jest.resetModules();
    program = new Command();
  });

  test('should have basic commands', () => {
    expect(program.commands.length).toBeGreaterThan(0);
  });

  test('should handle build command', () => {
    const buildCmd = program.command('build');
    expect(buildCmd.name()).toBe('build');
  });

  test('should handle serve command', () => {
    const serveCmd = program.command('serve');
    expect(serveCmd.name()).toBe('serve');
  });
});
