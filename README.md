# JsonBlog CLI v2

A modern CLI tool for generating static blogs from JSON files. This tool is language-agnostic and allows you to use custom generators to create your blog exactly how you want it.

## Features

- Generate static blogs from JSON files
- Use custom generators or the default boilerplate
- Live preview with auto-reload
- TypeScript support
- Modern Node.js practices
- Backward compatible with v1

## Installation

```bash
npm install -g jsonblog-cli
```

## Quick Start

```bash
# Create a new blog.json file
blog init

# Build your blog
blog build

# Preview locally with auto-reload
blog serve
```

## Commands

- `blog init` - Creates an example blog.json file
- `blog build [-g generator-name]` - Builds your blog to /build directory
- `blog serve [-p port] [-g generator-name]` - Runs a local server with live reload

## Using Custom Generators

You can use custom generators by:

1. Creating a local generator in your project directory
2. Installing a generator globally (e.g., `npm install -g jsonblog-generator-xxxxx`)
3. Specifying a generator with the `-g` flag

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Development mode
npm run dev
```

## Compatibility

This v2 release maintains full backward compatibility with v1 while adding modern features and improvements. Your existing blog.json files and generators will continue to work as before.

## Requirements

- Node.js >= 18.0.0

## License

ISC
