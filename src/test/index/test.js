var should = chai.should();

describe('index Main', function() {
    describe('#hello', function() {
        it('returns string', function() {
            Main().hello().should.be.a('string');
            Main().hello('').should.be.a('string');
            Main().hello(123).should.be.a('string');
            Main().hello('world').should.be.a('string');
        });
        it('returns hello world when inputs hello', function() {
            Main().hello('world').should.equal('hello world');
        });
        it('outputs length > 5', function() {
            Main().hello().should.have.length.above(5);
            Main().hello('').should.have.length.above(5);
            Main().hello('world').should.have.length.above(5);
        });
    });
});
