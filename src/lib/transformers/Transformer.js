import { join as joinPath } from 'path';
import { Buffer } from 'buffer';
import { replaceExtension } from 'gulp-util';
import through from 'through2';

export default class Transformer {
  transformFromDB(node, enc, cb) {
    cb();
  }

  fromDB() {
    const self = this;
    return through.obj(function(node, encoding, cb) {
      const typeDef = node.typeDefinition;

      if (self.constructor.applyToTypes[typeDef]) {
        self.transformFromDB(this, node, encoding, cb);
      } else {
        cb(null, node);
      }
    });
  }

  // Helpers
  encapsule(file, extname) {
    const base = replaceExtension(file.basename, '');
    file.path = joinPath(replaceExtension(file.path, ''), `${base}${extname || file.extname}`);
  }

  encapsuledFile(node, extname, contentString) {
    const file = node.clone({ contents: false });
    this.encapsule(file, extname);
    if (contentString !== undefined) {
      file.contents = Buffer.from(contentString);
    }

    return file;
  }

  // Constants
  static get applyToTypes() {
    return {};
  }
}

export const TransformDirection = {
  FromDB: 0,
  FromFilesystem: 1,
};
