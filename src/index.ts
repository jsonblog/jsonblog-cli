#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import basicGenerator from 'jsonblog-generator-boilerplate';
import express from 'express';
import chokidar from 'chokidar';
import path from 'path';

// Import legacy modules using require since they're CommonJS
const schema = require('jsonblog-schema');

const BUILD_PATH = `${process.cwd()}/./build`;
const DEFAULT_GENERATOR = 'jsonblog-generator-boilerplate';

interface ValidationResult {
  success: boolean;
  error?: string;
}

function requireUncached(module: string) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

const build = async (generator: any, blog: any) => {
  schema.validate(blog, (error: Error | null, result: ValidationResult | null) => {
    if (error || !result?.success) {
      console.error('Validation failed:', error || result?.error);
      return;
    }

    const files = generator(blog);

    // Clean up build dir and make again
    fs.removeSync(BUILD_PATH);
    fs.mkdirSync(BUILD_PATH);

    // Now write files given by the generator
    files.forEach((file: { name: string; content: string }) => {
      fs.outputFileSync(`${BUILD_PATH}/${file.name}`, file.content, 'utf8');
    });
    console.log('Build completed successfully!');
  });
};

const getBlog = (file: string) => {
  try {
    return require(`${process.cwd()}/${file}`);
  } catch (e) {
    console.error('Failed to load blog configuration:', e);
    process.exit(1);
  }
};

const getGenerator = async (name: string) => {
  let generator;

  // Try load a theme from current directory
  try {
    generator = requireUncached(`${process.cwd()}/index.js`);
  } catch (e) {
    console.log('Using default generator');
    generator = basicGenerator;
  }

  return generator;
};

const program = new Command();

program
  .name('jsonblog')
  .description('CLI tool for JsonBlog')
  .version('2.4.0');

program
  .command('init')
  .description('Create an example blog.json')
  .action(() => {
    const samplePath = path.join(__dirname, '..', 'samples', 'blog.json');
    const targetPath = path.join(process.cwd(), 'blog.json');
    fs.copyFileSync(samplePath, targetPath);
    console.log('Created blog.json with example content');
  });

program
  .command('build')
  .description('Build the blog')
  .option('-g, --generator <name>', 'Generator to use', DEFAULT_GENERATOR)
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    const blog = getBlog(config);
    const generator = await getGenerator(options.generator);
    await build(generator, blog);
  });

program
  .command('serve')
  .description('Serve the blog')
  .option('-p, --port <number>', 'Port to serve on', '3000')
  .action((options) => {
    const port = parseInt(options.port, 10);
    const app = express();
    app.use(express.static(BUILD_PATH));
    app.listen(port, () => {
      console.log(`Serving blog at http://localhost:${port}`);
    });
  });

program
  .command('watch')
  .description('Watch for changes and rebuild')
  .option('-g, --generator <name>', 'Generator to use', DEFAULT_GENERATOR)
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    const watcher = chokidar.watch([config, 'content/**/*', 'templates/**/*'], {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    console.log(`Watching ${config} and content directory for changes...`);
    
    watcher.on('change', async (path) => {
      console.log(`File ${path} has been changed`);
      const blog = getBlog(config);
      const generator = await getGenerator(options.generator);
      await build(generator, blog);
    });
  });

program.parse();
