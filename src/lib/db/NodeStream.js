import through from 'through2';
import { Buffer } from 'buffer';
import { File } from 'gulp-util';
import { Job } from 'atvise-dbworker';
import DBBrowser from './Browser';
import NodeAddress from '../NodeAddress';

class Node extends File {
  constructor(referenceDescription, readResult) {
    const source = readResult.value.value === null ?
      readResult.value : readResult.value.value;

    const path = NodeAddress.toFilePath(referenceDescription, readResult.value.dataType);
    const contents = Buffer.from(source.toString());

    super({ path, contents });

    this.dataType = readResult.value.dataType.key;
    this.typeDefinition = referenceDescription.typeDefinition.value;
  }
}

export default class SourceStream {
  static forNodes(startNodes) {
    const stream = through.obj();
    const browser = new DBBrowser();

    browser.on('discoveredvariables', nodes => {
      browser.worker.addJob(
        new Job((session, cb) => {
          session.read(nodes, function(err, nodesToRead, results) {
            if (!err) {
              results.forEach((res, i) => stream.push(new Node(nodesToRead[i], res)));
            }

            cb(err);
          });
        })
      );
    });

    browser.on('complete', () => {
      stream.end();
    });

    browser.browse(startNodes);

    return stream;
  }
}
