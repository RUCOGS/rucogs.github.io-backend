export class FuncQueue {
  methods: (() => void)[];

  constructor() {
    this.methods = [];
  }

  addFunc(method: () => void) {
    this.methods.push(method);
  }

  executeQueue() {
    while (this.methods.length > 0) {
      // shift() is dequeuing
      const method = this.methods.shift();
      if (method) method();
    }
  }
}
