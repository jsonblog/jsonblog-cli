# JsonBlog v2: A Modern Approach to JSON-Driven Static Blogs

JsonBlog has always been about simplicity and flexibility - a tool that lets you generate your blog from a simple JSON file. With version 2.0, we're bringing this concept into the modern era while maintaining the simplicity that made JsonBlog great.

## What is JsonBlog?

JsonBlog is a language-agnostic blogging framework that uses JSON as its core data format. The idea is simple: you create a `blog.json` file that contains all your blog's content and metadata, and JsonBlog generates a static website from it. What makes JsonBlog special is its generator system - you can use any generator you want, written in any language, to create your blog exactly how you want it.

The core principle remains: **your content should be separate from its presentation**.

## What's New in v2?

### 1. TypeScript Support
We've completely rewritten the CLI tool in TypeScript, bringing:
- Better type safety
- Improved code completion in modern editors
- Clear interfaces for custom generators
- Better error messages

### 2. Modern Development Experience
- Updated all dependencies to their latest versions
- Replaced deprecated libraries with modern alternatives
- Added ESLint and Prettier for code quality
- Improved development workflow with watch mode

### 3. Better Error Handling
- Colored console output for better readability
- More informative error messages
- Proper async/await throughout the codebase
- Better validation feedback

### 4. Improved Build Process
- Faster builds with modern Node.js features
- Better file watching with Chokidar
- Improved file path handling
- TypeScript-powered build pipeline

### 5. Better Documentation
- Updated README with clear instructions
- Better examples and use cases
- Improved API documentation
- Clear upgrade path from v1

## Backward Compatibility

One of our key goals with v2 was maintaining 100% backward compatibility. Your existing:
- `blog.json` files
- Custom generators
- Build outputs
- Workflows

All continue to work exactly as they did before. You can upgrade to v2 without changing any of your existing content or generators.

## Getting Started

```bash
# Install JsonBlog CLI
npm install -g jsonblog-cli

# Create a new blog
blog init

# Build your blog
blog build

# Preview locally with auto-reload
blog serve
```

## The Future

JsonBlog v2 sets the foundation for future improvements while maintaining the simplicity and flexibility that made the original version great. We're excited to see what you build with it!

Some areas we're looking at for future versions:
- Built-in TypeScript generator templates
- Better plugin system
- More built-in themes
- Enhanced development tools

## Contributing

JsonBlog is open source and we welcome contributions! Whether it's:
- Bug reports
- Feature requests
- Pull requests
- Custom generators
- Documentation improvements

Every contribution helps make JsonBlog better for everyone.

## Conclusion

JsonBlog v2 brings modern development practices to the simple, flexible blogging framework you know and love. It's a significant step forward that doesn't force you to change how you work. We can't wait to see what you create with it!
