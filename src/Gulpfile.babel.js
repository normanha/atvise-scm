import { dest } from 'gulp';
import { noop, log, colors } from 'gulp-util';
import NodeStream from './lib/db/NodeStream';
import { TransformDirection } from './lib/transformers/Transformer';

// Get project config
import Project, { path as configPath } from './lib/config/ProjectConfig';

log('Using project configuration', colors.magenta(configPath));

function applyTransforms(direction) {
  let stream = noop();

  const method = direction === TransformDirection.FromDB ?
    'fromDB' : 'fromFilesystem';

  Project.useTransformers.forEach(transformer => {
    stream = stream.pipe(transformer[method]());
  });

  return stream;
}

export function pull() {
  return NodeStream.forNodes(Project.nodes)
    .pipe(applyTransforms(TransformDirection.FromDB))
    .pipe(dest('src'));
}


/* import * as config from './lib/config';

 log('Using configuration at', colors.magenta(config.path));
 const projectConfig = config.get();

 export function sync() {
 let localFiles = 0;
 return src('src/***.*', { read: false })
 .on('data', function(...files) {
 files.forEach(f => {
 localFiles++;

 console.log(`${f.relative}: ${f.stat.mtime}`);
 const addr = new ResourceAddress(f.relative);
 console.log(addr.nodePath, addr.filePath);
 });
 })
 .on('end', () => log('Found', colors.cyan(localFiles), 'local files'));

 console.log('syncing');
 } */
