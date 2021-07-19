# Json Blog CLI

This is very much a tooling lib, Json Blog is meant to be language agnostic. Javascript sucks™,
but suits some needs perfectly. =D

```
 blog 1.0.0

 USAGE

   blog <command> [options]

 COMMANDS

   init                Downloads an example blog.json
   build               Builds your blog to /build (in default generator, check readme on how to use others)
   serve               Runs locally on your computer
   help <command>      Display help for a specific command

 GLOBAL OPTIONS

   -h, --help         Display help
   -V, --version      Display version
   --no-color         Disable colors
   --quiet            Quiet mode - only displays warn and error messages
   -v, --verbose      Verbose mode - will also output debug messages

```

### Getting started

```
npm install -g jsonblog-cli
blog init
blog build
// Open the output locally
```
