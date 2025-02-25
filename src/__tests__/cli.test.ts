import { program } from '../index';

describe('JsonBlog CLI', () => {
  it('should have generate command', () => {
    const generateCommand = program.commands.find(
      (cmd) => cmd.name() === 'generate'
    );
    expect(generateCommand).toBeTruthy();
  });

  it('should have watch command', () => {
    const watchCommand = program.commands.find((cmd) => cmd.name() === 'watch');
    expect(watchCommand).toBeTruthy();
  });
});
