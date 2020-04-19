var transform = require('../node.js');
var asynk = require('async');

var clone = function(o){return JSON.parse(JSON.stringify(o))};

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
            callback(undefined, transformedList.join("\n"));
        });
    },
    header : function(args, state, callback){
        var options = args[0];
        var text = args[1];
        var output = state.indent+'#'.repeat(options.level)+' '+text+"\n";
        callback(undefined, output);
    },
    bulletlist : function(args, state, callback){
        state.listLevel++;
        state.indent = '    '.repeat(state.listLevel);
        state.decorator = function(){ return '-' }
        var listItems = [];
        var ob = this;
        asynk.eachOfLimit(args, 1, function(node, index, done){
            ob.transformNode(undefined, node, state, function(err, transformed){
                if(err) return callback(err);
                listItems.push(transformed);
                done();
            });
        }, function(){
            var pred = state.listLevel===0?"\n":"";
            callback(undefined, listItems.join("\n")+pred);
        });
    },
    listitem : function(args, state, callback){
        var text = args[0];
        var sublist = args[1];
        var decorator = (state.decorator?state.decorator():'•');
        var output = state.indent+decorator+' '+text;
        var ob = this;
        if(sublist){
            ob.transformNode(undefined, sublist, clone(state), function(err, transformed){
                if(err) return callback(err);
                callback(undefined, output+"\n"+transformed);
            });
        }else callback(undefined, output);
    }
});

module.exports = trx;
