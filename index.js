#!/usr/bin/env node
const prog = require("caporal");
const fs = require("fs-extra");
const basicGenerator = require("jsonblog-generator-boilerplate");
const schema = require("jsonblog-schema");
const express = require("express");
const watch = require("watch");

const BUILD_PATH = `${process.cwd()}/./build`;
const DEFAULT_GENERATOR = "jsonblog-generator-boilerplate";

const blogExample = schema.example;
const validate = schema.validate;

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

const build = async (generator, blog) => {
  console.log("asdasd", generator);
  validate(blog, async err => {
    if (err) {
      console.log("validation failed", err);
    } else {
      console.log("carazy", generator);
      const files = await generator(blog);

      // Clean up build dir  and make again
      fs.removeSync(BUILD_PATH);
      fs.mkdirSync(BUILD_PATH);

      // Now write files given by the generator
      files.forEach(file => {
        fs.outputFileSync(`${BUILD_PATH}/${file.name}`, file.content, "utf8");
      });
    }
  });
};

const getBlog = () => {
  let blog;
};

const getGenerator = async name => {
  let generator;

  // Try load a theme from current directory
  try {
    generator = requireUncached(`${process.cwd()}/index.js`);
  } catch (e) {
    console.log("failed loading local generator");
  }

  const generatorName = name || DEFAULT_GENERATOR;

  console.log("generatorName", generatorName);

  // require locally if in theme directory
  if (typeof generator !== "function") {
    try {
      generator = require(generatorName);
    } catch (e) {
      // supplied generator not found
      console.log(
        "Supplied generator not found (try npm -g i jsonblog-generator-xxxxx)"
      );
      console.log("falling back to default");
      generator = require(DEFAULT_GENERATOR);
    }
  }
  // require package, fail if not found

  console.log("what is going on");
  console.log(generator);

  // require default
  return generator;
};

prog.version("1.0.0");

prog
  .command("init", "Downloadsaa an example blog.json")
  .action(function(args, options, logger) {
    // TODO - Check if there is already a blog.json. Warn is overide.
    fs.writeFileSync(
      "blog.json",
      JSON.stringify(blogExample, undefined, 2),
      "utf8"
    );
    console.log("Created file blog.json");
  })
  .command(
    "build",
    "Builds your blog to /build (in default generator, check readme on how to use others)"
  )
  .option(
    "--generator <name>",
    "Name of the generator e.g. jsonblog-generator-boilerplate"
  )
  .action(async function(args, options, logger) {
    try {
      const generator = await getGenerator(options.generator);
      blog = JSON.parse(await fs.readFileSync("./blog.json", "utf8"));
      await build(generator, blog);
    } catch (e) {}
  })
  .command("serve", "Runs locally on your computer")
  .option(
    "--generator <name>",
    "Name of the generator e.g. jsonblog-generator-boilerplate"
  )
  .action(function(args, options, logger) {
    let blog = JSON.parse(
      fs.readFileSync(`${process.cwd()}/./blog.json`, "utf8")
    );
    // TODO - ERROR - can't find a blog.json

    validate(blog, async err => {
      if (err) {
        console.log("Validation of blog.json failed", err);
      } else {
        watch.watchTree(
          process.cwd(),
          {
            filter: (f, d) => {
              const excludeDirs = ["node_modules", "build", ".git"];
              if (excludeDirs.some(element => f.includes(element))) {
                return false;
              } else {
                return true;
              }
            }
          },
          async (f, curr, prev) => {
            const generator = await getGenerator(options.generator);
            console.log("np", generator);
            if (typeof f == "object" && prev === null && curr === null) {
              // Finished walking the tree
            } else if (prev === null) {
              // f is a new file
            } else if (curr.nlink === 0) {
              // f was removed
            } else {
              console.log("blog.json has changed, rebuild");
              blog = JSON.parse(await fs.readFileSync("./blog.json", "utf8"));
              console.log("np", generator);
              await build(generator, blog);
            }
          }
        );

        const app = express();
        app.use(express.static("build"));
        app.listen(4321, () => console.log("Blog listening on port 4321!"));
      }
    });
  });

prog.parse(process.argv);
