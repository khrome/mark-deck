const asynk = require('async');
const extendClass = require('extend-interface');

let Trx = function(){}

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
Trx.extend = function(cls, cns){
    let cons = cns || function(){
        Trx.apply(this, arguments);
        return this;
    };
    return extendClass(cls, cons, Trx);
};

module.exports = Trx;
