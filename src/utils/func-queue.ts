export class FuncQueue {
  methods: (() => Promise<void>)[];

  constructor() {
    this.methods = [];
  }

  addFunc(method: () => Promise<void>) {
    this.methods.push(method);
  }

  async executeQueue() {
    while (this.methods.length > 0) {
      // shift() is dequeuing
      const method = this.methods.shift();
      if (method) await method();
    }
  }
}
