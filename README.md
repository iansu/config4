# Config4

This is a configuration library based on config3 but adapted to the pattern most commonly used on projects at Lottery.com. 

**Significant Changes**

- Loads from 4 places:  config.default.js, config.environent.js, config.local.js and environment
- Automatically parses booleans in environment vars that look like booleans `VARNAME=true`
- Automatically parses numbers in environment vars that look like numbers eg. `VARNAME=2`
- Parses double underscore `__` in environment vars as nested objects

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

