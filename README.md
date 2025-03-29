# logd

A powerful modular logging facility for node.js




[![npm](https://img.shields.io/npm/dm/logd.svg?style=flat-square)](https://www.npmjs.com/package/logd)

## Using Logd

In the main file of your application or library, import the module, define a 
namespace and set a transport for the log output.

```typescript
import logd from 'logd';

// define the module we're logging from
const log = logd.module('my-service');


// start logging
log.info('some information');


// you may pass as many arguments as you like 
// to the log methods
log.error('something went wrong', err, {some: 'data'});
```

## Enable logs: Node
```bash
node mysript.js --l
```

```bash
node mysript.js --l --warn
```

```bash
node mysript.js --log
```

```bash
node mysript.js --log --level=debug
```


## Enable logs: Browser

in the console

```javascript
logd.enable();
```

```javascript
logd.enable('error');
```