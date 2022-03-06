var transform = require('../node.js');
var asynk = require('async');
var hljs = require('highlight.js');

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
    img : function(args, state, callback){
        if(args[0] && args[0].href){
            var output = `<img alt="${args[0].alt}" src="${args[0].href}" />`;
        }
        callback(undefined, output);
    },
    link : function(args, state, callback){
        var output = '';
        if(args[0] && args[0].href){
            var output = `<a target="_blank" href="${args[0].href}">${args[1]}</a>`;
        }
        callback(undefined, output);
    },
    para : function(args, state, callback){
        let output = '';
        if(args[0] && args[0][0] === 'inlinecode'){
            let text = args[0][1];
            let target = text.indexOf("\n");
            let type = text.substring(0, target).trim();

            let body = text.substring(target+1);
            if(type){ //highliht syntax
                output = `<section><pre><br/>
    ${hljs.highlight(body, {language: type}).value}
 </pre></section>`
            }else{ //no highlight
                output = `<section><pre><code data-trim data-noescape>
    ${body}
 </code></pre></section>`
            }
        }
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
        if(Array.isArray(args[0])){
            this.transformNode(undefined, args[0], clone(state), function(err, transformed){
                if(err) return callback(err);
                callback(undefined, transformed);
            });
            return;
        }
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
