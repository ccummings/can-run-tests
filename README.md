# can-run-tests

A CLI tool for testing can-* repos against canjs.

This tool allows you to test local changes to a can-* package against the main canjs repository.

## Installation

`$ npm install can-run-tests --save-dev`
`$ yarn add can-run-tests --dev`

## Caveats

The can-* package you are working on must:
- be a dependency of `can` [check here](https://github.com/canjs/canjs/blob/master/package.json).
- have its tests run be `can` [check here](https://github.com/canjs/canjs/blob/master/test/test.js)

## Usage

`$ node_modules/.bin/can-run-tests`

A local `.can-test` folder will be created. It contains the local clone of CanJS and its dependencies. It's recommended 
to keep this folder so running the tool doesn't have to clone the CanJS repository and and install all of its 
dependencies each time.

Make sure you add `.can-run-tests` to your `.gitignore` and `.npmignore`.

## What it does

1. Creates a `.can-run-test` directory
2. If `.can-run-tests/canjs` exists
  - Reset local clone of CanJS, otherwise
  - Clone CanJS from GitHub
3. Updates the CanJS `package.json` to pull the `can-*` project you are working on from the file system
4. Runs `npm install` in the CanJS directory
> If this isn't the first time `npm install` has been run, only the `can-*` dependency will be installed.

5. Runs `npm test` in the CanJS directory

## Changelog

### 0.0.1

- Initial release

## License

Released under the [MIT License](https://opensource.org/licenses/mit-license.php).

