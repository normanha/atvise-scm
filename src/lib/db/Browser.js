import Emitter from 'events';
import DBWorker, { Job } from 'atvise-dbworker';
import { log } from 'gulp-util';
import Project from '../config/ProjectConfig';

const NodeClass = {
  Object: 1,
  Variable: 2,
};

export default class DBBrowser extends Emitter {
  constructor(options = {}) {
    super();

    this.worker = new DBWorker(`opc.tcp://${Project.host}:${Project.port.opc}`);
    this.recursive = options.recursive || true;
    this.browsed = {};
  }

  browseNodes(session, nodes, cb) {
    session.browse(nodes, (err, results) => {
      if (err) {
        cb(err);
      } else {
        const nextNodes = [];
        const discoveredVariables = [];

        results.forEach((result, resultIndex) => {
          if (result.statusCode > 0) {
            cb(result.statusCode);
          } else {
            result.references.forEach(ref => {
              const id = ref.nodeId.toString();

              if (this.browsed[id] === undefined && (id.split(nodes[resultIndex]).length > 1)) {
                this.browsed[id] = true;

                nextNodes.push(id);

                if (ref.nodeClass.value === NodeClass.Variable) {
                  this.emit('discovered', ref);
                  discoveredVariables.push(ref);
                }
              }
            });
          }
        });

        if (this.recursive && nextNodes.length > 0) {
          this.worker.addJob(new Job((...args) => this.browseNodes(...args), nextNodes));
        }

        if (discoveredVariables.length > 0) {
          this.emit('discoveredvariables', discoveredVariables);
        }

        cb();
      }
    });
  }

  browse(nodes) {
    this.worker.addJob(new Job((...args) => this.browseNodes(...args), nodes));

    this.worker.on('error', err => log(err));

    this.worker.once('complete', () => {
      log('Found', Object.keys(this.browsed).length, 'Nodes');
      this.emit('complete');
    });

    this.worker.start();
  }
}
