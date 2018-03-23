# Config4

This is a configuration library based on config3 but adapted to the pattern most commonly used on projects at Lottery.com. 

**Significant Changes**

- Loads from 4 places:  config.default.js, config.environent.js, config.local.js and environment
- Automatically parses booleans in environment vars that look like booleans `VARNAME=true`
- Automatically parses numbers in environment vars that look like numbers eg. `VARNAME=2`
- Parses double underscore `__` in environment vars as nested objects

## How To Use

Add to your package.json

` "config4": "git+https://github.com/autolotto/config4.git#0.1.0", `

Import 

` const config = require('config4'); `

Use 

` const myVar = config.SOME_CONSTANT; `

## What To Commit

Because you can have environment specific configuration files AND set environment variables, a good convention is:

1.  Put common configuration in `config.default.js`
2.  Put non-secret environment configuration in `config.production.js`
3.  Put secret environment configuration (like credentials) in environment variable on Heroku

This way, we:

- Are not committing any credentials or passwords to git
- Have a manageable number of environment variables
- Can easily add settings like feature flags to files when we write code

## Environment Vars Nested Objects

Environment variables like this: 

 ```
 MONKEY__SEE__DO=banana
``` 

become

``` 
 MONKEY: {
   SEE: {
     DO: "banana" 
   }
 }
    
```


## Load Order

Loads configuration in the following order:

`config.default.js` -  Loaded first and sets up any universal defaults.

`config.{environment}.js` -  Loaded second and does environment specific configs.

`config.local.js` - Override or add to anything that you set in default file.

`environment vars` - Environment vars override everything.

## Attribution for Past Work

- Inspired by config3 which was used at lottery.com in the past
- Based on some code from configery, a deprecated lottery.com library

