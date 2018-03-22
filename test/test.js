/* eslint-disable unicorn/import-index,ava/no-async-fn-without-await */
const test = require('ava');

test.serial('Loading configuration files', async (t) => {
  const config = require('../index');
  t.truthy(config.DEFAULT_PATH);
  t.truthy(config.OVERRIDE_DEFAULT);
  t.truthy(config.SOMETHING);
  t.truthy(config.LOCAL_PATH);
  t.is(config.OVERRIDE_DEFAULT, 'local');
});

test.serial('Overriding files with env var', async (t) => {
  try {
    process.env.OVERRIDE_DEFAULT = 'test';
    const { init } = require('../index');
    const config = init();
    t.truthy(config.DEFAULT_PATH);
    t.truthy(config.OVERRIDE_DEFAULT);
    t.truthy(config.SOMETHING);
    t.truthy(config.LOCAL_PATH);
    t.is(config.OVERRIDE_DEFAULT, 'test');
  } finally {
    delete process.env.OVERRIDE_DEFAULT;
  }
});

test.serial('loading boolean values from environment', async (t) => {
  try {
    process.env.BOOL_T = true;
    process.env.BOOL_F = false;
    const { init } = require('../index');
    const config = init();
    t.is(config.OVERRIDE_DEFAULT, 'local');
    t.is(config.BOOL_T, true);
    t.is(config.BOOL_F, false);
  } finally {
    delete process.env.BOOL_T;
    delete process.env.BOOL_F;
  }
});

test.serial('loading number values from environment', async (t) => {
  try {
    process.env.NUM_V = 42;
    const { init } = require('../index');
    const config = init();
    t.is(config.NUM_V, 42);
  } finally {
    delete process.env.NUM_V;
  }
});


test.serial('loading deep nested values from environment', async (t) => {
  try {
    process.env.MONKEY__SEE__DO = 'banana';
    const { init } = require('../index');
    const config = init();
    t.is(config.MONKEY.SEE.DO, 'banana');
  } finally {
    delete process.env.MONKEY__SEE__DO;
  }
});

