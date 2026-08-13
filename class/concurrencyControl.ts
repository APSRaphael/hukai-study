class concurrencyControl {
  private maxConcurrency: number;
  private queue: any[];
  private running: number;
  private onAllTasksCompleted: Function;

  constructor(
    maxConcurrency: number,
    onAllTasksCompleted: Function = () => {}
  ) {
    this.maxConcurrency = maxConcurrency;
    this.queue = [];
    this.running = 0;
    this.onAllTasksCompleted = onAllTasksCompleted;
  }

  addQueue(queue: Function[]) {
    this.queue.push(...queue);
    this.run();
  }

  addTask(task: Function) {
    this.queue.push(task);
    this.run();
  }

  run() {
    while (this.running < this.maxConcurrency && this.queue.length) {
      this.running++;
      const task = this.queue.shift();
      Promise.resolve(task()).finally(() => {
        this.running--;
        this.run();
        if (this.running === 0 && this.queue.length === 0) {
          this.onAllTasksCompleted();
        }
      });
    }
  }
}

export default concurrencyControl;
