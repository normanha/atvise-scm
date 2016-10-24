import { Buffer } from 'buffer';
import { parseString as parseXML, Builder as XMLBuilder } from 'xml2js';
import Transformer from './Transformer';

export default class DisplayTransformer extends Transformer {
  constructor() {
    super();
    this.xmlBuilder = new XMLBuilder();
  }

  transformFromDB(stream, node, enc, cb) {
    parseXML(node.contents, (err, results) => {
      const xml = results;
      const document = results.svg;

      const config = {};

      // Extract JavaScript
      if (document.script && document.script.length > 0) {
        document.script.forEach(script => {
          if (script.$ && script.$.src) {
            // is external script, link in config
            if (!config.dependencies) { config.dependencies = []; }
            config.dependencies.push(script.$.src);
          } else {
            // is display script, save in own file
            stream.push(this.encapsuledFile(node, '.js', script._));
          }
        });

        delete xml.svg.script;
      }

      // Save config
      stream.push(this.encapsuledFile(node, '.json', JSON.stringify(config, null, '  ')));

      // Save pure SVG code
      stream.push(this.encapsuledFile(node, '.svg', this.xmlBuilder.buildObject(xml)));

      cb();
    });
  }

  static get applyToTypes() {
    return {
      'VariableTypes.ATVISE.Display': true,
    };
  }
}
