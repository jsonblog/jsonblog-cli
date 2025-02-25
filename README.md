# JsonBlog CLI

[![npm version](https://badge.fury.io/js/jsonblog-cli.svg)](https://badge.fury.io/js/jsonblog-cli)
[![CI](https://github.com/jsonblog/jsonblog-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/jsonblog/jsonblog-cli/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)

A powerful, flexible static blog generator that puts content first. Write your blog posts in Markdown, manage them in JSON, and deploy anywhere.

## Why JsonBlog?

- **Content Freedom**: Your content, your way. Store posts inline in JSON, as local files, remote URLs, or even on IPFS
- **Format Flexibility**: Content can be Markdown, plain text, or even HTML - you choose what works best
- **Zero Lock-in**: All content is pure JSON and text - no proprietary formats or databases
- **Flexible Deployment**: Generate static HTML that can be hosted anywhere - GitHub Pages, Netlify, IPFS, or your own server
- **Developer Friendly**: Built with TypeScript, well-documented, and extensible
- **Modern Stack**: Uses [jsonblog-generator-boilerplate](https://github.com/jsonblog/jsonblog-generator-boilerplate) under the hood for clean, modern HTML output

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
      "title": "Markdown Post",
      "content": "# My First Post\n\nWelcome to my blog!",
      "publishedDate": "2025-02-25"
    },
    {
      "title": "Plain Text Post",
      "content": "Just a simple text post.\nNo special formatting needed.",
      "publishedDate": "2025-02-25"
    },
    {
      "title": "HTML Post",
      "content": "<h1>Direct HTML</h1><p>Write HTML directly if you prefer!</p>",
      "publishedDate": "2025-02-25"
    },
    {
      "title": "Remote Content",
      "contentUrl": "https://example.com/posts/remote-post.md",
      "publishedDate": "2025-02-25"
    },
    {
      "title": "IPFS Content",
      "contentUrl": "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      "publishedDate": "2025-02-25"
    }
  ]
}
```

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

## Related Projects

- [jsonblog-generator-boilerplate](https://github.com/jsonblog/jsonblog-generator-boilerplate) - The core generator used by this CLI

## Creating Your Own Generator

Want to create your own blog theme? It's easy! A generator is just a package that takes your blog content and generates HTML using your own templates and styles.

1. Fork the [generator-boilerplate](https://github.com/jsonblog/jsonblog-generator-boilerplate) repository
2. Customize the templates in the `templates` directory
3. Modify the styles in `assets/main.css`
4. Update the generator logic in `src/index.ts` if needed
5. Publish your generator to npm as `jsonblog-generator-yourname`

Your generator just needs to export a function that takes a blog config and outputs HTML files. The boilerplate handles all the complex stuff like Markdown rendering and file management.

Example generators:
- `jsonblog-generator-minimal` - A minimal, typography-focused theme
- `jsonblog-generator-bootstrap` - A Bootstrap-based theme
- Create your own!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
