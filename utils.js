'use strict';
const fs = require('fs');
const Git = require('nodegit');
const spawn = require('cross-spawn-async');
const chalk = require('chalk');

exports.runCommand = function (cmd, args, opts) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, opts);

    child.on('exit', status => {
      if (status) {
        reject(`Command '${cmd} did not complete successfully`);
      } else {
        resolve(child);
      }
    });
  });
};

exports.dirExists = path => {
  try {
    fs.accessSync(path);
		return true;
  } catch (e) {
    return false;
  }
};

exports.resetRepo = repoPath => {
  let repository;
  return Git.Repository.open(repoPath).then(repo => {
    repository = repo;
		return repository.fetch('origin');
  }).then(() => {
    return repository.getBranchCommit('HEAD');
  }).then(originHeadCommit => {
    return Git.Reset.reset(repository, originHeadCommit, Git.Reset.TYPE.HARD);
  });
};

exports.handleError = (msg, err) => {
  console.log(chalk.red(`ERROR ${msg}`), err);
  process.exit(1);
};

exports.info = chalk.yellow;
exports.progress = chalk.green;
exports.error = chalk.red;
