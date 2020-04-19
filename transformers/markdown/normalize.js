//normalize rewrites the markdown
var transform = require('./markdown-node.js');
var Trx = transform.extend({
    transform : function(markdown, node, callback){
        var state = this.newState();
        this.transformNode(markdown, node, state, function(err, transformed){
            callback(err, '<section data-markdown>'+"\n"+
            '<textarea data-template>'+"\n"+
            transformed+"\n"+
            '</textarea>'+"\n"+
            '</section>');
        });
    }
});
module.exports = new Trx();
