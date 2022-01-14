describe("outer describe", function() {
  beforeAll(function() {
    console.log("outer BefAll");
  });

  beforeEach(function() {
    console.log("-------------------");
    console.log("outer BefEach");
  });

  afterAll(function() {
    console.log("-------------------");
    console.log("outer AftAll");
  });

  afterEach(function() {
    console.log("outer AftEach");
  });

  describe("inner describe", function() {
    beforeAll(function() {
      console.log("inner BefAll");
    });

    beforeEach(function() {
      console.log("inner BefEach");
    });

    afterAll(function() {
      console.log("inner AftAll");
    });

    afterEach(function() {
      console.log("inner AftEach");
    });

    it("spec one", function() {
      console.log("Spec One")
    });

    it("spec two", function() {
      console.log("Spec Two")
    });
  });
});