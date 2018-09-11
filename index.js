/* eslint-disable unicorn/prefer-type-error */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const debug = require('debug')('config4');

const appRoot =
  process.env.CONFIG_ROOT === 'test'
    ? path.resolve(path.join(__dirname, 'samples'))
    : path.resolve(path.join(__dirname, '../..'));

function load(file) {
  const config = require(file);
  if (!config || _.isEmpty(config)) {
    console.warn(`Cannot read data from ${file}`);
    return {};
  }
  return config;
}

function mergeConfig(file, existingConfig = {}) {
  if (!file) return existingConfig;

  let config = existingConfig;
  const plainFile = path.resolve(path.join(appRoot, `${file}.js`));

  try {
    if (fs.existsSync(plainFile)) {
      debug(`Loading ${file}.js`);
      config = _.merge(config, load(plainFile));
    } else {
      debug(`Config Not Found: ${file}`);
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`File contents of ${file} are not valid!`);
    }
    throw err;
  }
  return config;
}

function readEnvironment() {
  return _.mapValues(process.env, v => {
    if (v && v.toLowerCase() === 'true') return true;
    if (v && v.toLowerCase() === 'false') return false;
    if (v && !isNaN(v) && v.indexOf('.') >= 0) return parseFloat(v, 10);
    if (v && !isNaN(v) && v.indexOf('.') < 0) return parseInt(v, 10);
    return v;
  });
}

function init() {
  let config = {};
  config = mergeConfig('config.default', config);
  if (process.env.NODE_ENV && process.env.NODE_ENV.length) {
    const environmentFileNAme = `config.${process.env.NODE_ENV.toLowerCase()}`;
    config = mergeConfig(environmentFileNAme, config);
  }
  config = mergeConfig('config.local', config);

  const envVars = readEnvironment();
  _.forOwn(envVars, (v, k) => {
    if (!k.startsWith('_')) {
      _.set(config, k.replace(/__/g, '.'), v);
    }
  });

  debug(`Loaded config: ${JSON.stringify(config, null, 2)}`);
  return config;
}

module.exports = init();
module.exports.init = init;
