console.log('Usage: DEFAULT_FILE=config.default.js CONFIG_FILE=production.js node ./diff-file-with-defaults.js');
const _ = require('lodash');
const path = require('path');

const flatten = require('flat');
const unflatten = flatten.unflatten;

const Heroku = require('heroku-client');
new Heroku({ token: process.env.HEROKU_API_TOKEN });

const appRoot =
  process.env.CONFIG_ROOT === 'test'
    ? path.resolve(path.join(__dirname, 'samples'))
    : path.resolve(path.join(__dirname, '.'));

// get defaults flattened
async function loadDefaults() {
  const fileName = process.env.DEFAULT_FILE || 'config.default.js';
  const defaultFile = path.resolve(path.join(appRoot, fileName));
  return flatten(require(defaultFile));
}

// get vars flattened;
async function loadConfigFile() {
  const configFile = path.resolve(path.join(appRoot, process.env.CONFIG_FILE));
  return flatten(require(configFile));
}

async function getDifference(defaultConfig) {
  const envConfig = await loadConfigFile();
  return _.reduce(
    envConfig,
    (diff, v, k) => {
      if (!defaultConfig[k] || !_.isEqual(defaultConfig[k], v)) diff[k] = v;
      return diff;
    },
    {}
  );
}

loadDefaults()
  .then(defaultConfig => getDifference(defaultConfig))
  .then(diff => unflatten(diff))
  .then(diff => {
    console.log(JSON.stringify(diff, null, 2));
  })
  .catch(console.error);
