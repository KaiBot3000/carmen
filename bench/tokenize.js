var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var assert = require('assert');
var termops = require('../lib/util/termops');
var argv = require('minimist')(process.argv.slice(2));

module.exports = benchmark;

function benchmark(minSample, cb) {
    if (!cb) cb = function(){};
    console.log('# tokenize');

    suite.add('tokenize', function() {
        assert.deepEqual(termops.tokenize('Chamonix-Mont-Blanc'), ['chamonix','mont','blanc']);
    }, { 'minSamples': minSample })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
      console.log();
      cb(null, suite);
    })
    .run();
}

if (!process.env.runSuite) benchmark(argv.minSample || 100);