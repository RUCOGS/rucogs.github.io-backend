describe('Hello World Suite', function() {
  it('check if text is \'Hello World\'', function(done) {
    const text = 'Hello World';
    expect(text).toBe('Hello World');
    done();
  });
  it('check if another text is \'Hello World\'', function(done) {
    const text = 'Not Hello World';
    expect(text).toBe('Hello World');
    done();
  });
});
