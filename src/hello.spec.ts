describe('test object containing', function() {
  it('should pass', function() {
    expect({
      array: [1, 2, 3]
    }).toEqual(jasmine.objectContaining({
      array: jasmine.objectContaining([13420])
    }));
  });
});
