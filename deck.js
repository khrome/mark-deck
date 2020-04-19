var asynk = require('async');
var md = require('markdown').markdown;
var deck = function(options){
    this.options = options || {};
}
deck.prototype.parse = function(markdownPresentation, callback){
    var pages = markdownPresentation.split(/-+\{([a-zA-Z_-]+)\}-/gi);
    var options = JSON.parse(pages.shift().trim() || '{}');
    var pgs = [];
    while(pages.length){
        pgs.push({
            name : pages.shift(),
            markdown : pages.shift()
        });
    }
    setTimeout(function(){
        callback(undefined, pgs);
    },0);
}
deck.prototype.render = function(pages, callback){
    var pgs = pages;
    var type = 'simple';
    var format = 'markdown';
    if(!Array.isArray(pages)){
        pgs = pages.pages;
        if(pages.type) type = pages.type;
        if(pages.format) format = pages.format;
    }
    var ob = this;
    var parallelize = (this.options.parallelize || 1);
    var slides = [];
    var slidesByName = {};
    var errs = [];
    asynk.eachOfLimit(pgs, parallelize, function(page, index, done){
        ob.processSlide(page, type, format, function(err, html){
            slides[index] = html;
            slidesByName[page.name] = html;
            done();
        });
    }, function(){
        if(errs.length){
            var err = errs[0];
            err.errs = errs;
            return callback(err);
        }
        return callback(undefined, slides, slidesByName);
    });
}
deck.prototype.processSlide = function(slide, type, format, callback){
    var node = md.parse( slide.markdown, 'Maruku' );
    //this.transform('html', 'simple', slide.markdown, node, callback);
    this.transform(type, format, slide.markdown, node, callback);
}
//todo: support mode x format
var transformers = {};
var getTransformer = function(format, mode){
    var key = format+':'+mode;
    if(!transformers[key]){
        transformers[key] = require(__dirname+'/transformers/'+format+'/'+mode+'.js');
    }
    return transformers[key];
}
deck.prototype.transform = function(format, mode, text, node, callback){
    var transformer = getTransformer(format, mode);
    transformer.transform(text, node, function(err, transformed){
        callback(undefined, transformed);
    });
}
deck.prototype.write = function(directory, pages, callback){
    var ob = this;
    if(arguments.length === 3 && typeof arguments[1] === 'string'){
        ob.readFile(pages, function(err, body){
            ob.parse(body.toString(), function(err, pages){

            });
        });
    }
}

module.exports = deck;
