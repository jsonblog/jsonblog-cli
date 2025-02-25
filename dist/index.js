#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_extra_1 = __importDefault(require("fs-extra"));
const jsonblog_generator_boilerplate_1 = __importDefault(require("jsonblog-generator-boilerplate"));
const express_1 = __importDefault(require("express"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
// Import legacy modules using require since they're CommonJS
const schema = require('jsonblog-schema');
const BUILD_PATH = `${process.cwd()}/./build`;
const DEFAULT_GENERATOR = 'jsonblog-generator-boilerplate';
function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}
const build = async (generator, blog) => {
    schema.validateBlog(blog).then(({ success, error }) => {
        if (!success) {
            console.error('Validation failed:', error);
        }
        else {
            const files = generator(blog);
            // Clean up build dir and make again
            fs_extra_1.default.removeSync(BUILD_PATH);
            fs_extra_1.default.mkdirSync(BUILD_PATH);
            // Now write files given by the generator
            files.forEach((file) => {
                fs_extra_1.default.outputFileSync(`${BUILD_PATH}/${file.name}`, file.content, 'utf8');
            });
            console.log('Build completed successfully!');
        }
    });
};
const getBlog = (file) => {
    try {
        return require(`${process.cwd()}/${file}`);
    }
    catch (e) {
        console.error('Failed to load blog configuration:', e);
        process.exit(1);
    }
};
const getGenerator = async (name) => {
    let generator;
    // Try load a theme from current directory
    try {
        generator = requireUncached(`${process.cwd()}/index.js`);
    }
    catch (e) {
        console.log('Using default generator');
        generator = jsonblog_generator_boilerplate_1.default;
    }
    return generator;
};
const program = new commander_1.Command();
program
    .name('jsonblog')
    .description('CLI tool for JsonBlog')
    .version('2.3.0');
program
    .command('init')
    .description('Create an example blog.json')
    .action(() => {
    const samplePath = path_1.default.join(__dirname, '..', 'samples', 'blog.json');
    const targetPath = path_1.default.join(process.cwd(), 'blog.json');
    fs_extra_1.default.copyFileSync(samplePath, targetPath);
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
    const app = (0, express_1.default)();
    app.use(express_1.default.static(BUILD_PATH));
    app.listen(options.port, () => {
        console.log(`Serving blog at http://localhost:${options.port}`);
    });
});
program
    .command('watch')
    .description('Watch for changes and rebuild')
    .option('-g, --generator <name>', 'Generator to use', DEFAULT_GENERATOR)
    .argument('[config]', 'Path to blog config file', 'blog.json')
    .action(async (config, options) => {
    const watcher = chokidar_1.default.watch([config, 'content/**/*', 'templates/**/*'], {
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
