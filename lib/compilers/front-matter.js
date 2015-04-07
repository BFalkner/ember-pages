var CachingWriter = require('broccoli-caching-writer'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    walkSync = require('walk-sync'),
    _ = require('lodash'),
    path = require('path');


function createTree(pathArray, leaf) {
  if (pathArray.length === 0) return [leaf];

  var obj = {};
  obj[pathArray[0]] = createTree(pathArray.slice(1), leaf);
  return obj;
}

function mergeArrays(lhs, rhs) {
  if (_.isArray(lhs)) return lhs.concat(rhs);
}

// https://github.com/jekyll/jekyll/blob/0e52b83b6f9df43b1e1a66a675a877b4d86222a2/lib/jekyll/document.rb#L10
var YAML_FRONT_MATTER_REGEXP = /^(---\s*\n.*?\n?)^((---|\.\.\.)\s*$\n?)/m;
function extractData(srcDir, relPath) {
  var string = fs.readFileSync(path.join(srcDir, relPath), { encoding: 'utf8' }),
      matches = YAML_FRONT_MATTER_REGEXP.exec(string);

  if (matches === null)
    return {};

  return yaml.safeLoad(matches[1]);
}

module.exports = CachingWriter.extend({
  enforceSingleInputTree: true,

  updateCache: function(srcPath, destDir) {
    var data = walkSync(srcPath).reduce(function(acc, relPath) {
      if (relPath.substr(-1) === '/') return acc;

      var url = relPath.replace(/\.\w+$/, '.html'),
          leaf = _.merge(extractData(srcPath, relPath), { url: '/' + url }),
          pathArray = relPath.split('/'),
          tree = createTree(pathArray.slice(0, -1), leaf);

      return _.merge(acc, tree, mergeArrays);
    }, {}),
        jsonString = JSON.stringify(data),
        jsString = 'export default ' + jsonString + ';',
        writeDir = path.join(destDir, 'pages'),
        writePath = path.join(writeDir, 'meta-data.js');

    fs.mkdirSync(writeDir);
    fs.writeFileSync(writePath, jsString, { encoding: 'utf8' });
  }
});
