#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_extra_1 = __importDefault(require("fs-extra"));
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
// Import legacy modules using require since they're CommonJS
const basicGenerator = require('jsonblog-generator-boilerplate');
const schema = require('jsonblog-schema');
const BUILD_PATH = path_1.default.join(process.cwd(), 'build');
const DEFAULT_GENERATOR = 'jsonblog-generator-boilerplate';
const requireUncached = (module) => {
    delete require.cache[require.resolve(module)];
    return require(module);
};
// Promisify the schema.validate function
const validateBlog = (blog) => {
    return new Promise((resolve, reject) => {
        schema.validate(blog, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result?.valid ?? false);
            }
        });
    });
};
const build = async (generator, blog, blogPath) => {
    try {
        const isValid = await validateBlog(blog);
        if (!isValid) {
            console.error(chalk_1.default.red('Blog validation failed'));
            return;
        }
        console.log('Blog data:', JSON.stringify(blog, null, 2));
        console.log('Generator type:', typeof generator);
        // Use the directory containing blog.json as the base path
        const basePath = path_1.default.dirname(blogPath);
        const files = await generator(blog, basePath);
        // Clean up build dir and make again
        await fs_extra_1.default.remove(BUILD_PATH);
        await fs_extra_1.default.mkdir(BUILD_PATH);
        // Write files given by the generator
        await Promise.all(files.map(async (file) => {
            const filePath = path_1.default.join(BUILD_PATH, file.name);
            await fs_extra_1.default.outputFile(filePath, file.content, 'utf8');
        }));
        console.log(chalk_1.default.green('Build completed successfully'));
    }
    catch (error) {
        console.error(chalk_1.default.red('Build failed:'), error);
    }
};
const getBlog = async (blogPath) => {
    try {
        const absolutePath = path_1.default.resolve(blogPath);
        const blogContent = await fs_extra_1.default.readFile(absolutePath, 'utf8');
        return JSON.parse(blogContent);
    }
    catch (error) {
        console.error(chalk_1.default.red(`Failed to read ${blogPath}:`), error);
        process.exit(1);
    }
};
const getGenerator = async (name) => {
    let generator;
    // Try load a theme from current directory
    try {
        generator = requireUncached(path_1.default.join(process.cwd(), 'index.js'));
    }
    catch (error) {
        console.log(chalk_1.default.yellow('No local generator found'));
    }
    const generatorName = name || DEFAULT_GENERATOR;
    // require globally if not in generator directory
    if (typeof generator !== 'function') {
        try {
            generator = require(generatorName);
        }
        catch (error) {
            console.log(chalk_1.default.yellow('Supplied generator not found (try npm -g i jsonblog-generator-xxxxx)'));
            console.log('Falling back to default generator');
            generator = require(DEFAULT_GENERATOR);
        }
    }
    if (typeof generator !== 'function') {
        throw new Error('Failed to load a valid generator');
    }
    return generator;
};
const program = new commander_1.Command();
program
    .name('blog')
    .description('A CLI tool to generate static blogs from JSON files')
    .version('2.0.0');
program
    .command('init')
    .description('Creates an example blog.json')
    .action(async () => {
    const blogPath = path_1.default.join(process.cwd(), 'blog.json');
    if (await fs_extra_1.default.pathExists(blogPath)) {
        console.log(chalk_1.default.yellow('Warning: blog.json already exists. Overwriting...'));
    }
    await fs_extra_1.default.writeFile(blogPath, JSON.stringify(schema.example, null, 2), 'utf8');
    console.log(chalk_1.default.green('Created file blog.json'));
});
program
    .command('build')
    .description('Builds your blog to /build')
    .argument('<blogFile>', 'Path to blog.json file')
    .option('-g, --generator <n>', 'Name of the generator')
    .action(async (blogFile, options) => {
    try {
        const generator = await getGenerator(options.generator);
        const blog = await getBlog(blogFile);
        await build(generator, blog, blogFile);
    }
    catch (error) {
        console.error(chalk_1.default.red('Build command failed:'), error);
        process.exit(1);
    }
});
program
    .command('serve')
    .description('Runs locally on your computer')
    .argument('<blogFile>', 'Path to blog.json file')
    .option('-p, --port <number>', 'Port to run on', '3000')
    .option('-g, --generator <n>', 'Name of the generator')
    .action(async (blogFile, options) => {
    try {
        const app = (0, express_1.default)();
        const port = parseInt(options.port, 10);
        // Initial build
        const generator = await getGenerator(options.generator);
        const blog = await getBlog(blogFile);
        await build(generator, blog, blogFile);
        // Serve static files
        app.use(express_1.default.static(BUILD_PATH));
        // Watch for changes
        const watcher = chokidar_1.default.watch([blogFile, '*.js'], {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        watcher.on('change', async (path) => {
            console.log(chalk_1.default.blue(`File ${path} has been changed`));
            try {
                const generator = await getGenerator(options.generator);
                const blog = await getBlog(blogFile);
                await build(generator, blog, blogFile);
                console.log(chalk_1.default.green('Rebuild completed'));
            }
            catch (error) {
                console.error(chalk_1.default.red('Rebuild failed:'), error);
            }
        });
        app.listen(port, () => {
            console.log(chalk_1.default.green(`Server running at http://localhost:${port}`));
            console.log(chalk_1.default.blue('Watching for changes...'));
        });
    }
    catch (error) {
        console.error(chalk_1.default.red('Serve command failed:'), error);
        process.exit(1);
    }
});
program.parse();
