#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as schema from 'jsonblog-schema';
import express from 'express';
import * as chokidar from 'chokidar';
import logger from './logger';

const BUILD_PATH = `${process.cwd()}/./build`;
const DEFAULT_GENERATOR = 'jsonblog-generator-boilerplate';

const getGenerator = (generatorName?: string) => {
  if (!generatorName) {
    logger.info('Using default generator');
    return require('jsonblog-generator-boilerplate');
  }
  logger.info({ generator: generatorName }, 'Using custom generator');
  return require(generatorName);
};

const build = async (generator: any, blog: any) => {
  logger.info('Starting build process');
  const result = await schema.validateBlog(blog);
  if (!result.success) {
    logger.error({ error: result.error }, 'Blog validation failed');
    return;
  }

  // Get the directory of the blog.json file to use as base path
  const blogDir = process.cwd();
  logger.debug({ basePath: blogDir }, 'Using base path');
  
  try {
    const files = await generator(blog, blogDir);
    logger.debug({ fileCount: files.length }, 'Generated files');
    
    // Clean up build dir and make again
    logger.debug({ path: BUILD_PATH }, 'Cleaning build directory');
    fs.removeSync(BUILD_PATH);
    fs.mkdirSync(BUILD_PATH);

    // Now write files given by the generator
    files.forEach((file: { name: string; content: string }) => {
      logger.debug({ file: file.name }, 'Writing file');
      fs.outputFileSync(`${BUILD_PATH}/${file.name}`, file.content, 'utf8');
    });
    logger.info({ fileCount: files.length }, 'Build completed successfully');
  } catch (error) {
    logger.error({ error }, 'Build process failed');
  }
};

const getBlog = (file: string) => {
  try {
    const blogPath = path.resolve(file);
    logger.debug({ path: blogPath }, 'Loading blog configuration');
    return fs.readJsonSync(blogPath);
  } catch (error) {
    logger.error({ error, file }, 'Failed to load blog configuration');
    process.exit(1);
  }
};

const program = new Command();

program
  .name('jsonblog')
  .description('CLI tool for JsonBlog')
  .version('2.6.0');

program
  .command('init')
  .description('Create an example blog.json')
  .action(() => {
    const samplePath = path.join(__dirname, '..', 'samples', 'blog.json');
    const targetPath = path.join(process.cwd(), 'blog.json');
    fs.copyFileSync(samplePath, targetPath);
    logger.info('Created blog.json with example content');
  });

program
  .command('build')
  .description('Build the blog')
  .option('-g, --generator <name>', 'Generator to use', DEFAULT_GENERATOR)
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    logger.info({ file: config, generator: options.generator }, 'Starting build command');
    const blog = getBlog(config);
    const generator = getGenerator(options.generator);
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
      logger.info({ port }, 'Serving blog at http://localhost:${port}');
    });
  });

program
  .command('watch')
  .description('Watch for changes and rebuild')
  .option('-g, --generator <name>', 'Generator to use', DEFAULT_GENERATOR)
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    logger.info({ file: config, generator: options.generator }, 'Starting watch command');
    const watcher = chokidar.watch([config, 'content/**/*', 'templates/**/*'], {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    logger.info(`Watching ${config} and content directory for changes...`);
    
    watcher.on('change', async (path) => {
      logger.info({ path }, 'File change detected');
      const blog = getBlog(config);
      const generator = getGenerator(options.generator);
      await build(generator, blog);
      logger.info('Rebuild completed');
    });
  });

program.parse();
