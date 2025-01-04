type Task = {
  method: (...params: any[]) => Promise<void>;
  params: unknown[];
  delay?: number;
};

class InMemoryQueue {
  private queue: Task[] = [];
  private isProcessing: boolean = false;

  /**
   * Add a task to the queue.
   * @param task - A function that returns a promise.
   */
  public start(task: Task): void {
    this.queue.push(task);
    this.processQueue();
  }

  /**
   * Add a task to the queue with a delay.
   * @param task - A function that returns a promise.
   * @param delay - Delay in milliseconds.
   */
  public enqueue(task: Task): void {
    setTimeout(() => this.start(task), task.delay ?? 0);
  }

  /**
   * Process the queue, executing tasks one by one.
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      if (task) {
        try {
          await task.method(...task.params);
        } catch (error) {
          console.error("Task failed:", error);
        }
      }
    }

    this.isProcessing = false;
  }
}

export const taskQueue = new InMemoryQueue();
