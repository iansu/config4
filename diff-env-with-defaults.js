console.log('Usage: DEFAULT_FILE=config.default.js HEROKU_API_TOKEN=token HEROKU_APP=autolotto-backend-production node ./diff-env-with-defaults.js');
const _ = require('lodash');
const path = require('path');

const flatten = require('flat');
const unflatten = flatten.unflatten;

const Heroku = require('heroku-client');
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });

const appRoot = process.env.CONFIG_ROOT === 'test' ?
  path.resolve(path.join(__dirname, 'samples')) :
  path.resolve(path.join(__dirname, '../..'));

// get defaults flattened
async function loadDefaults() {
  const fileName = process.env.DEFAULT_FILE || 'config.default.js';
  const defaultFile = path.resolve(path.join(appRoot, fileName));
  return flatten(require(defaultFile));
}

// get vars flattened;
async function exportVars() {
  // load env vars from heroku
  const rawVars = await heroku.get(`/apps/${process.env.HEROKU_APP}/config-vars`);
  // translate config vars into dot delimited form.
  return _.mapKeys(rawVars, (v, k) => k.replace(/__/g, '.'));
}

async function getDifference(defaultConfig) {
  const envConfig = await exportVars();
  return _.reduce(envConfig, (diff, v, k) => {
    if (!defaultConfig[k] || !_.isEqual(defaultConfig[k], v)) diff[k] = v;
    return diff;
  }, {});
}

loadDefaults()
  .then(defaultConfig => getDifference(defaultConfig))
  .then(diff => unflatten(diff))
  .then(diff => {
    console.log(JSON.stringify(diff, null, 2));
  });
