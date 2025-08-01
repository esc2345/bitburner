export class Batch {

  static options = new Set(['weaken', 'grow', 'hack']);
  static isValidOption(s) {
    return this.options.has(s);
  }

  constructor(type, target) {
    if (!Batch.isValidOption(type)) {
      throw "Invalid batch type"
    }
    this.batchType = type;
    this.target = target;
    this.tasks = [];
  }

  addTask(type, threads) {
    if (!Batch.isValidOption(type)) {
      throw "Invalid task type"
    }
    this.tasks.push({ 'type': type, 'threads': threads });
  }
}
