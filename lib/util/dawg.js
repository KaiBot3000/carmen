var _dawgCache = require("dawg-cache");
var DEBUG = process.env.DEBUG;

var WriteCache = function() {
    this.data = {};
}

WriteCache.prototype.setText = function(text) {
    if (text == "") {
        throw new Error("The DAWG cache can't store the empty string");
    } else {
        var first = text.substr(0,3);
        this.data[first] = this.data[first] || {};
        this.data[first][text] = 1;
    }
}

WriteCache.prototype.dump = function() {
    var dawg = new _dawgCache.Dawg();
    var prefixes = Object.keys(this.data).sort();
    for (var i = 0; i < prefixes.length; i++) {
        var phrases = Object.keys(this.data[prefixes[i]]);
        phrases.sort();
        for (var j = 0; j < phrases.length; j++) {
            dawg.insert(phrases[j]);
        }
    }
    dawg.finish();

    return dawg.toCompactDawgBuffer();
}

var ReadCache = function(buf) {
    _dawgCache.CompactDawg.call(this, buf);
}

ReadCache.prototype = Object.create(_dawgCache.CompactDawg.prototype);

ReadCache.prototype.hasPhrase = function(subq) {
    return subq.ender ? this.lookupPrefix(subq.text) : this.lookup(subq.text);
}

var DawgCache = function(buf) {
    if (buf && buf.length) {
        return new ReadCache(buf);
    } else {
        return new WriteCache();
    }
}

ReadCache.prototype.properties = WriteCache.prototype.properties = {
    needsText: true,
    needsDegens: false,
    type: "dawg"
}

// build a ReadCache at the last minute if hasPhrase is ever called on WriteCache; define after ReadCache to appease the linter
WriteCache.prototype.hasPhrase = function(phraseObj) {
    if (DEBUG) console.warn("calling hasPhrase on a DAWG WriteCache is very inefficient")
    return (new ReadCache(this.dump())).hasPhrase(phraseObj);
}

module.exports = DawgCache;
