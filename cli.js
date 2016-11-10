#!/usr/bin/env node
'use strict';

const Git = require('nodegit');
const resolve = require('path').resolve;
const fse = require('fs-extra');
const utils = require('./utils');

const TEST_DIR = '.can-run-tests';
const CANJS_REPO_URL = 'https://github.com/canjs/canjs';
const CANJS_REPO_DIR = 'canjs';
  
const thisPkg = fse.readJsonSync(`./package.json`);
const thisName = thisPkg.name;

console.log(utils.progress(`Running CanJS tests with latest changes from ${thisName}`));
fse.ensureDirSync(TEST_DIR);

let repoPromise;
if(!utils.dirExists(`./${TEST_DIR}/${CANJS_REPO_DIR}`)) {
  console.log(utils.info(`Cloning CanJS from '${CANJS_REPO_URL}'`));
	repoPromise =  Git.Clone.clone(CANJS_REPO_URL, `./${TEST_DIR}/${CANJS_REPO_DIR}`).catch(e => {
		utils.handleError('Cloning CanJS', e);
	});
} else {
	repoPromise = utils.resetRepo(`${TEST_DIR}/${CANJS_REPO_DIR}`);
}

repoPromise.then(() => {
	const canPath = resolve(process.cwd(), `${TEST_DIR}/${CANJS_REPO_DIR}`);
	const canPkg = fse.readJsonSync(`${TEST_DIR}/${CANJS_REPO_DIR}/package.json`);
	canPkg.dependencies[thisName] = '../../';
  console.log(utils.info(`Updating ${thisName} dependency in package.json`));
  fse.writeJsonSync(`${TEST_DIR}/${CANJS_REPO_DIR}/package.json`, canPkg);
  console.log(utils.info(`Removing '${TEST_DIR}/${CANJS_REPO_DIR}/node_modules/${thisName}'`));
	fse.removeSync(`${TEST_DIR}/${CANJS_REPO_DIR}/node_modules/${thisName}`);
  console.log(utils.progress(`Running 'npm install' in ${canPath}`));
	utils.runCommand('npm', ['install', '--loglevel', 'error'], {
		stdio: 'inherit',
		cwd: canPath
	}).then(() => {
    console.log(utils.progress(`Running 'npm test' in ${canPath}`));
		utils.runCommand('npm', ['test'], {
			stdio: 'inherit',
			cwd: canPath
		});
	});
});
