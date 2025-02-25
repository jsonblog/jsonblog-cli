# JsonBlog CLI

[![npm version](https://badge.fury.io/js/jsonblog-cli.svg)](https://badge.fury.io/js/jsonblog-cli)
[![CI](https://github.com/jsonblog/jsonblog-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/jsonblog/jsonblog-cli/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)

A command-line interface for JsonBlog, making it easy to generate and manage your static blog from JSON files.

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

## Usage

```bash
# Generate your blog
jsonblog generate path/to/blog.json

# Watch for changes and regenerate
jsonblog watch path/to/blog.json
```

## Blog Configuration

Your blog configuration should be a JSON file that follows the JsonBlog schema. Here's a basic example:

```json
{
  "site": {
    "title": "My Blog",
    "description": "A blog about my thoughts"
  },
  "basics": {
    "name": "John Doe"
  },
  "posts": [
    {
      "title": "Hello World",
      "content": "# My First Post\n\nWelcome to my blog!",
      "publishedDate": "2025-02-25"
    }
  ]
}
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

### Prerequisites

- Node.js >= 20.0.0
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/jsonblog/jsonblog-cli.git
cd jsonblog-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Available Scripts

- `npm run build` - Build the TypeScript code
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Release Process

1. Make your changes
2. Run tests and linting: `npm test && npm run lint`
3. Use one of the following commands to create a new version:
   - `npm run release:patch` - Bug fixes (1.0.0 -> 1.0.1)
   - `npm run release:minor` - New features (1.0.0 -> 1.1.0)
   - `npm run release:major` - Breaking changes (1.0.0 -> 2.0.0)
4. Create a new release on GitHub to trigger the publishing workflow

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Compatibility

This v2 release maintains full backward compatibility with v1 while adding modern features and improvements. Your existing blog.json files and generators will continue to work as before.

## Requirements

- Node.js >= 18.0.0

## License

This project is licensed under the MIT License - see the LICENSE file for details.
