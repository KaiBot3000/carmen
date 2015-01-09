var path = require('path');
var fs = require('fs');
var tilelive = require('tilelive');

module.exports = {};

// Auto loader for a single source from filepath/uri.
module.exports.auto = function(uri) {
    uri = tilelive.auto(uri);
    
    if (!tilelive.protocols[uri.protocol]) throw new Error('Invalid tilesource protocol');
    return new tilelive.protocols[uri.protocol](uri, function() {});
};

// Generate a Geocoder options hash automatically reading sources in a directory.
module.exports.autodir = function(dirname) {
    var dir = path.resolve(dirname);
    var files = fs.readdirSync(dir).map(function(f) {
        return {
            pathname: dir + '/' + f,
            extname: path.extname(f),
            prefix: f.split('.')[0],
            dbid: f.split('.')[0],
            filter: f
        };
    }).filter(function(file) {
        return file.filter.indexOf('.') !== 0;
    });
    
    files.sort(sortByPrefix);
    return files.reduce(function(opts, f) {
        opts[f.dbid] = module.exports.auto(f.pathname);
        return opts;
    }, {});
};

function sortByPrefix(a, b) {
    return a.prefix < b.prefix ? -1 : a.prefix > b.prefix ? 1 : 0;
}
