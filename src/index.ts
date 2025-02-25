#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import express from 'express';
import chalk from 'chalk';
import chokidar from 'chokidar';
import path from 'path';

// Import legacy modules using require since they're CommonJS
const basicGenerator = require('jsonblog-generator-boilerplate');
const schema = require('jsonblog-schema');

const BUILD_PATH = path.join(process.cwd(), 'build');
const DEFAULT_GENERATOR = 'jsonblog-generator-boilerplate';

interface BlogFile {
  name: string;
  content: string;
}

interface Generator {
  (blog: any): Promise<BlogFile[]>;
}

const requireUncached = (module: string): any => {
  delete require.cache[require.resolve(module)];
  return require(module);
};

// Promisify the schema.validate function
const validateBlog = (blog: any): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    schema.validate(blog, (err: Error | null, result: { valid: boolean } | null) => {
      if (err) {
        reject(err);
      } else {
        resolve(result?.valid ?? false);
      }
    });
  });
};

const build = async (generator: Generator, blog: any): Promise<void> => {
  try {
    const isValid = await validateBlog(blog);
    if (!isValid) {
      console.error(chalk.red('Blog validation failed'));
      return;
    }

    const files = await generator(blog);

    // Clean up build dir and make again
    await fs.remove(BUILD_PATH);
    await fs.mkdir(BUILD_PATH);

    // Write files given by the generator
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(BUILD_PATH, file.name);
        await fs.outputFile(filePath, file.content, 'utf8');
      })
    );

    console.log(chalk.green('Build completed successfully'));
  } catch (error) {
    console.error(chalk.red('Build failed:'), error);
  }
};

const getBlog = async (): Promise<any> => {
  try {
    const blogPath = path.join(process.cwd(), 'blog.json');
    const blogContent = await fs.readFile(blogPath, 'utf8');
    return JSON.parse(blogContent);
  } catch (error) {
    console.error(chalk.red('Failed to read blog.json:'), error);
    process.exit(1);
  }
};

const getGenerator = async (name?: string): Promise<Generator> => {
  let generator: Generator | undefined;

  // Try load a theme from current directory
  try {
    generator = requireUncached(path.join(process.cwd(), 'index.js'));
  } catch (error) {
    console.log(chalk.yellow('No local generator found'));
  }

  const generatorName = name || DEFAULT_GENERATOR;

  // require globally if not in generator directory
  if (typeof generator !== 'function') {
    try {
      generator = require(generatorName);
    } catch (error) {
      console.log(
        chalk.yellow(
          'Supplied generator not found (try npm -g i jsonblog-generator-xxxxx)'
        )
      );
      console.log('Falling back to default generator');
      generator = require(DEFAULT_GENERATOR);
    }
  }

  if (typeof generator !== 'function') {
    throw new Error('Failed to load a valid generator');
  }

  return generator;
};

const program = new Command();

program
  .name('blog')
  .description('A CLI tool to generate static blogs from JSON files')
  .version('2.0.0');

program
  .command('init')
  .description('Creates an example blog.json')
  .action(async () => {
    const blogPath = path.join(process.cwd(), 'blog.json');
    
    if (await fs.pathExists(blogPath)) {
      console.log(chalk.yellow('Warning: blog.json already exists. Overwriting...'));
    }
    
    await fs.writeFile(
      blogPath,
      JSON.stringify(schema.example, null, 2),
      'utf8'
    );
    console.log(chalk.green('Created file blog.json'));
  });

program
  .command('build')
  .description('Builds your blog to /build')
  .option('-g, --generator <name>', 'Name of the generator')
  .action(async (options) => {
    try {
      const generator = await getGenerator(options.generator);
      const blog = await getBlog();
      await build(generator, blog);
    } catch (error) {
      console.error(chalk.red('Build command failed:'), error);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Runs locally on your computer')
  .option('-p, --port <number>', 'Port to run on', '3000')
  .option('-g, --generator <name>', 'Name of the generator')
  .action(async (options) => {
    try {
      const app = express();
      const port = parseInt(options.port, 10);
      
      // Initial build
      const generator = await getGenerator(options.generator);
      const blog = await getBlog();
      await build(generator, blog);

      // Serve static files
      app.use(express.static(BUILD_PATH));

      // Watch for changes
      const watcher = chokidar.watch(['blog.json', '*.js'], {
        ignored: /(^|[\/\\])\../,
        persistent: true
      });

      watcher.on('change', async (path) => {
        console.log(chalk.blue(`File ${path} has been changed`));
        try {
          const generator = await getGenerator(options.generator);
          const blog = await getBlog();
          await build(generator, blog);
          console.log(chalk.green('Rebuild completed'));
        } catch (error) {
          console.error(chalk.red('Rebuild failed:'), error);
        }
      });

      app.listen(port, () => {
        console.log(chalk.green(`Server running at http://localhost:${port}`));
        console.log(chalk.blue('Watching for changes...'));
      });
    } catch (error) {
      console.error(chalk.red('Serve command failed:'), error);
      process.exit(1);
    }
  });

program.parse();
