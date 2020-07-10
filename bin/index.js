#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-disable no-undef */

/******************************
 * @file: kao-cli
 * @desc: create react-n-page cli
 * @author: quantran
 ******************************/

const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const tip = require("./tip");
const Git = require("nodegit");
const argv = process.argv;
let packageJson = {};

try {
  packageJson = require(path.resolve(__dirname, "../package.json"));
} catch (err) {
  if (argv[2] != "init") {
    console.log(chalk.red("no package.json!"));
  }
}

/**
 * Determines whether the folder exists
 *
 * @param {*} path
 * @returns
 */
function isExist(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, (err) => {
      if (err !== null) {
        reject(`${path} does not exist`);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * create project
 *
 * @param {*} dist project name
 */
function init(dist) {
  isExist(dist)
    .then(() => {
      console.log(tip.error(`${dist} was exist`));
    })
    .catch(() => {
      console.log(
        chalk.blueBright(
          `
        ${dist} is creating...
        `
        )
      );
      Git.Clone("https://github.com/trtquan/webpack", dist).then(() => {
        fs.removeSync(path.resolve(dist, ".git"));
        fs.removeSync(path.resolve(dist, "_config.yml"));
        fs.removeSync(path.resolve(dist, "README.md"));
        fs.removeSync(path.resolve(dist, "README-ZH.md"));
        fs.removeSync(path.resolve(dist, "LICENSE"));
        fs.removeSync(path.resolve(dist, "react-multi.png"));
        fs.removeSync(path.resolve(dist, "package-lock.json"));
        console.log(
          chalk.green(
            `
        ${dist} created success !
    
            `
          )
        );
      });
    });
}

const mainLogic = {
  "init"  : (Pname) => Pname ? init(Pname) : console.log(tip.error("input project name")),
  "--help": () => tip.help(packageJson.version),
  "-v"    : () => console.log(`version: ${packageJson.version}`),
};

// main function
function main() {
  mainLogic[argv[2]] ? mainLogic[argv[2]](argv[3]) : tip.help(packageJson.version);
}

main();
