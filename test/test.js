var should = require('chai').should();
var fs = require('fs');
var MarkDeck = require('../deck.js');
describe('mark-deck', function(){
    var deckText;
    before(function(done){
        fs.readFile(__dirname+'/test.md', function(err, text){
            deckText = text.toString();
            should.exist(deckText);
            done();
        });
    });

    it('splits cards', function(done){
        var deck = new MarkDeck();
        should.exist(deckText);
        (typeof deckText).should.equal('string');
        deck.parse(deckText, function(err, pages){
            should.not.exist(err);
            should.exist(pages);
            pages.length.should.equal(2)
            done();
        });
    });

    it('renders cards in raw markdown with an equal double parse', function(done){
        var deck = new MarkDeck();
        should.exist(deckText);
        (typeof deckText).should.equal('string');
        deck.parse(deckText, function(err, pages){
            deck.render({
                pages : pages,
                format : 'markdown',
                type : 'markdown',
            }, function(err, slides, slidesIndex){
                var output = '';
                Object.keys(slidesIndex).forEach(function(key){
                    output += '---------------------------{'+key+'}-'+"\n"+
                        slidesIndex[key];
                });
                deck.parse(output, function(err, newPages){
                    should.exist(pages);
                    should.exist(newPages);
                    pages.should.deep.equal(newPages);
                    done();
                });
            });
        });
    });

    it('renders cards in html wrapped markdown', function(done){
        var deck = new MarkDeck();
        should.exist(deckText);
        (typeof deckText).should.equal('string');
        deck.parse(deckText, function(err, pages){
            deck.render({
                pages : pages,
                format : 'normalize',
                type : 'markdown',
            }, function(err, slides, slidesIndex){
                slides.forEach(function(slide){
                    slide.should.contain('<section data-markdown>');
                    slide.should.contain('</section>');
                    slide.should.contain('<textarea data-template>');
                    slide.should.contain('</textarea>');
                });
                done();
            });
        });
    });
});
