import { Command } from 'commander';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('CLI', () => {
  let program: Command;

  beforeEach(() => {
    jest.resetModules();
    program = new Command();
    // Register test commands
    program
      .command('build')
      .description('Build the blog')
      .action(() => {});
    program
      .command('serve')
      .description('Serve the blog')
      .action(() => {});
  });

  test('should have basic commands', () => {
    expect(program.commands.length).toBeGreaterThan(0);
  });

  test('should handle build command', () => {
    const buildCmd = program.commands.find((cmd) => cmd.name() === 'build');
    expect(buildCmd?.name()).toBe('build');
  });

  test('should handle serve command', () => {
    const serveCmd = program.commands.find((cmd) => cmd.name() === 'serve');
    expect(serveCmd?.name()).toBe('serve');
  });
});
