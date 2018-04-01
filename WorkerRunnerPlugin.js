const crypto = require('crypto');

class WorkerRunnerPlugin {
  constructor(options) {
    this.options = options;

    if (!this.options.contentScripts || !this.options.contentScripts.length || !this.options.filename) {
      throw new Error('contentScripts and filename are required.');
    }
  }


  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const files = this.options.contentScripts.map((file) => {
        const match = Object.keys(compilation.assets).find((asset) => asset.match(file));

        if (!match) {
          throw new Error('No file found.');
        }

        return match
      });

      const source = `
        self.window = self;
        ${files.map((file) => `self.importScripts('/${file}');`).join('\n')}
      `;

      const name = this.options.filename.split('.').map((part) => {
        if (part !== '[hash]') {
          return part;
        }

        const hash = crypto.createHash('sha256');
        hash.update(source, 'utf-8');
        return hash.digest('hex').slice(0, 20)
      }).join('.');

      compilation.assets[name] = {
        source: () => source,
        size: () => source.length
      };

      if (this.options.replaceFilename === this.options.filename) {
        return callback();
      }

      Object.keys(compilation.assets).forEach((key) => {
        if (!this.options.replacer(key)) {
          return
        }

        const file = compilation.assets[key];
        const source = file.source().replace(this.options.replaceFilename, name);
        file.source = () => source;
        file.length = () => source.length;
      });

      callback();
    });
  }
}

module.exports = WorkerRunnerPlugin;
