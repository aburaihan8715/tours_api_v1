/* eslint-disable node/no-unsupported-features/node-builtins */

import crypto from 'crypto';

const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');

console.table({ key1, key2 });
