#!/usr/bin/env node
const prog = require("caporal");
const fs = require("fs-extra");
const basicGenerator = require("jsonblog-generator-basic");
const schema = require("jsonblog-schema");
const express = require("express");
const watch = require("watch");

const BUILD_PATH = "./build";

const blogExample = schema.example;
const validate = schema.validate;

const build = async (generator, blog) => {
  validate(blog, async err => {
    if (err) {
      console.log("validation failed", err);
    } else {
      console.log("Validation success");
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

prog.version("1.0.0");

prog
  .command("init", "Downloads an example blog.json")
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
  .action(async function(args, options, logger) {
    try {
      const generator = basicGenerator; // or meta data generator
      await build(generator, blogExample);
    } catch (e) {}
  })
  .command("serve", "Runs locally on your computer")
  .action(function(args, options, logger) {
    let blog = JSON.parse(fs.readFileSync("./blog.json", "utf8"));
    // TODO - ERROR - can't find a blog.json
    validate(blog, async err => {
      if (err) {
        console.log("Validation of blog.json failed", err);
      } else {
        console.log("Validation success");
        watch.watchTree(
          "./",
          {
            filter: (f, d) => {
              if (["node_modules", "build", ".git"].indexOf(f) !== -1) {
                return false;
              } else {
                return true;
              }
            }
          },
          function(f, curr, prev) {
            if (typeof f == "object" && prev === null && curr === null) {
              // Finished walking the tree
            } else if (prev === null) {
              // f is a new file
            } else if (curr.nlink === 0) {
              // f was removed
            } else {
              if (f === "blog.json") {
                console.log("blog.json has changed, rebuild");
                blog = JSON.parse(fs.readFileSync("./blog.json", "utf8"));
                build(basicGenerator, blog);
              }
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
