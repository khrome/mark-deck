

module.exports = {
    transform : function(markdown, node, callback){
        callback(undefined, '<section data-markdown>'+"\n"+
            '<textarea data-template>'+"\n"+
            markdown+"\n"+
            '</textarea>'+"\n"+
            '</section>');
    }
};
