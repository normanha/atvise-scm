import { join as joinPath } from 'path';
import * as ProjectDefaults from './Atviseproject';

export const path = joinPath(process.cwd(), 'Atviseproject.js');

require('babel-register')({
  presets: ['node6'],
});
const custom = require(path);
const joined = Object.assign(ProjectDefaults, custom);

export default joined;
