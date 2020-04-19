var asynk = require('async');

var Trx = function(){}

Trx.prototype.transform = function(markdown, node, callback){
    var state = this.newState();
    this.transformNode(markdown, node, state, function(err, transformed){
        callback(err, transformed);
    });
}
Trx.prototype.newState = function(markdown, node, callback){
    return {
        listLevel : -1,
        indent: '',
        isBlock : false
    };
}
Trx.prototype.transformNode = function(markdown, node, state, callback){
    var arguments = JSON.parse(JSON.stringify(node));
    var thisState = JSON.parse(JSON.stringify(state));
    var action = arguments.shift();
    if(!this[action]) throw new Error('Unknown Node:'+action);
    this[action](arguments, state, function(err, transformed){
        return callback(err, transformed);
    });
}
var makeMergedCopyAndExtendify = function(ext, supr, cls){
    var copy = supr || function(){};
    Object.keys(cls.prototype).forEach(function(key){
        copy.prototype[key] = cls.prototype[key];
    });
    Object.keys(ext).forEach(function(key){
        copy.prototype[key] = ext[key];
    });
    copy.extend = function(ext, supr){
        return makeMergedCopyAndExtendify(ext, supr, copy);
    }
    return copy;
}
Trx.extend = function(ext, supr){
    var copy = makeMergedCopyAndExtendify(ext, supr, Trx);
    return copy;
}

module.exports = Trx;
