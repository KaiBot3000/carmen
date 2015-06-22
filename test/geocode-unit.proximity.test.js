//Proximity flag

var tape = require('tape');
var Carmen = require('..');
var index = require('../lib/index');
var mem = require('../lib/api-mem');
var addFeature = require('../lib/util/addfeature');

var conf = {
    country: new mem({maxzoom: 1}, function() {}),
    province: new mem({maxzoom: 6}, function() {})
};
var c = new Carmen(conf);

tape('index country', function(t) {
    var country = {
        _id:1,
        _text:'country',
        _zxy:['1/0/0'],
        _center:[-100,60]
    };
    addFeature(conf.country, country, t.end);
});
tape('index country', function(t) {
    var country = {
        _id:2,
        _text:'country',
        _zxy:['1/0/1'],
        _center:[-60,-20]
    };
    addFeature(conf.country, country, t.end);
});

//Across layers
tape('index province', function(t) {
    var province = {
        _id:1,
        _text:'province',
        _zxy:['6/17/24'],
        _center:[-80,40]
    };
    addFeature(conf.province, province, t.end);
});
tape('index province', function(t) {
    var country = {
        _id:3,
        _text:'province',
        _zxy:['1/1/0'],
        _center:[145,70]
    };
    addFeature(conf.country, country, t.end);
});

tape('forward country - single layer - limit', function(t) {
    c.geocode('country', { limit_verify: 1, }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'country', 'found country');
        t.equals(res.features[0].id, 'country.1', 'found country.1');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

tape('forward country - proximity - single layer - limit', function(t) {
    c.geocode('country', { limit_verify: 1, proximity: [-60,-20] }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'country', 'found country');
        t.equals(res.features[0].id, 'country.2', 'found country.2');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

tape('forward country - proximity - single layer - limit', function(t) {
    c.geocode('country', { limit_verify: 1, proximity: [-100,60] }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'country', 'found country');
        t.equals(res.features[0].id, 'country.1', 'found country.1');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

tape('forward country - multi layer - limit', function(t) {
    c.geocode('province', { limit_verify: 1, }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'province', 'found province');
        t.equals(res.features[0].id, 'country.3', 'found country.3');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

tape('forward country - single layer', function(t) {
    c.geocode('country', { }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'country', 'found country');
        t.equals(res.features[0].id, 'country.1', 'found country.1');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

tape('forward country - proximity - single layer', function(t) {
    c.geocode('country', { proximity: [-60,-20] }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'country', 'found country');
        t.equals(res.features[0].id, 'country.2', 'found country.2');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

tape('forward country - proximity - single layer', function(t) {
    c.geocode('country', { proximity: [-100,60] }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'country', 'found country');
        t.equals(res.features[0].id, 'country.1', 'found country.1');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

tape('forward country - multi layer', function(t) {
    c.geocode('province', { }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'province', 'found province');
        t.equals(res.features[0].id, 'country.3', 'found country.3');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

//If two results are returned prox will only sort if the relev and idx are the same
tape('forward country - repect layer presidence', function(t) {
    c.geocode('province', { proximity: [-80,40] }, function (err, res) {
        t.ifError(err);
        t.equals(res.features[0].place_name, 'province', 'found province');
        t.equals(res.features[0].id, 'country.3', 'found country.3');
        t.equals(res.features[0].relevance, 0.99);
        t.end();
    });
});

tape('index.teardown', function(assert) {
    index.teardown();
    assert.end();
});

