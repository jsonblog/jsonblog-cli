#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const schema = __importStar(require("jsonblog-schema"));
const express_1 = __importDefault(require("express"));
const chokidar = __importStar(require("chokidar"));
const logger_1 = __importDefault(require("./logger"));
const BUILD_PATH = `${process.cwd()}/./build`;
const DEFAULT_GENERATOR = 'jsonblog-generator-boilerplate';
const getGenerator = (generatorName) => {
    if (!generatorName) {
        logger_1.default.info('Using default generator');
        return require('jsonblog-generator-boilerplate');
    }
    logger_1.default.info({ generator: generatorName }, 'Using custom generator');
    return require(generatorName);
};
const build = async (generator, blog) => {
    logger_1.default.info('Starting build process');
    const result = await schema.validateBlog(blog);
    if (!result.success) {
        logger_1.default.error({ error: result.error }, 'Blog validation failed');
        return;
    }
    // Get the directory of the blog.json file to use as base path
    const blogDir = process.cwd();
    logger_1.default.debug({ basePath: blogDir }, 'Using base path');
    try {
        const files = await generator(blog, blogDir);
        logger_1.default.debug({ fileCount: files.length }, 'Generated files');
        // Clean up build dir and make again
        logger_1.default.debug({ path: BUILD_PATH }, 'Cleaning build directory');
        fs.removeSync(BUILD_PATH);
        fs.mkdirSync(BUILD_PATH);
        // Now write files given by the generator
        files.forEach((file) => {
            logger_1.default.debug({ file: file.name }, 'Writing file');
            fs.outputFileSync(`${BUILD_PATH}/${file.name}`, file.content, 'utf8');
        });
        logger_1.default.info({ fileCount: files.length }, 'Build completed successfully');
    }
    catch (error) {
        logger_1.default.error({ error }, 'Build process failed');
    }
};
const getBlog = (file) => {
    try {
        const blogPath = path.resolve(file);
        logger_1.default.debug({ path: blogPath }, 'Loading blog configuration');
        return fs.readJsonSync(blogPath);
    }
    catch (error) {
        logger_1.default.error({ error, file }, 'Failed to load blog configuration');
        process.exit(1);
    }
};
const program = new commander_1.Command();
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
    logger_1.default.info('Created blog.json with example content');
});
program
    .command('build')
    .description('Build the blog')
    .option('-g, --generator <name>', 'Generator to use', DEFAULT_GENERATOR)
    .argument('[config]', 'Path to blog config file', 'blog.json')
    .action(async (config, options) => {
    logger_1.default.info({ file: config, generator: options.generator }, 'Starting build command');
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
    const app = (0, express_1.default)();
    app.use(express_1.default.static(BUILD_PATH));
    app.listen(port, () => {
        logger_1.default.info({ port }, 'Serving blog at http://localhost:${port}');
    });
});
program
    .command('watch')
    .description('Watch for changes and rebuild')
    .option('-g, --generator <name>', 'Generator to use', DEFAULT_GENERATOR)
    .argument('[config]', 'Path to blog config file', 'blog.json')
    .action(async (config, options) => {
    logger_1.default.info({ file: config, generator: options.generator }, 'Starting watch command');
    const watcher = chokidar.watch([config, 'content/**/*', 'templates/**/*'], {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });
    logger_1.default.info(`Watching ${config} and content directory for changes...`);
    watcher.on('change', async (path) => {
        logger_1.default.info({ path }, 'File change detected');
        const blog = getBlog(config);
        const generator = getGenerator(options.generator);
        await build(generator, blog);
        logger_1.default.info('Rebuild completed');
    });
});
program.parse();
