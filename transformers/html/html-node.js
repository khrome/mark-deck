var transform = require('../node.js');
var asynk = require('async');

var trx = transform.extend({
    markdown : function(arguments, state, callback){
        var transformedList = [];
        var ob = this;
        asynk.eachOfLimit(arguments, 1, function(node, index, done){
            ob.transformNode(undefined, node, state, function(err, transformed){
                if(err) return callback(err);
                transformedList[index] = transformed;
                done();
            });
        }, function(){
            callback(undefined, transformedList);
        });
    },
    header : function(args, state, callback){
        var options = args[0];
        var text = args[1];
        var html = '<h'+options.level+'>'+text+'</h'+options.level+'>';
        console.log('HEADER', args, state, html);
    }
});
trx.isHTML = true;

module.exports = trx;
