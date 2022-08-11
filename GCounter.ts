export default class GCounter {
  private id: number;
  public state: number[];

  constructor(id: number, size: number) {
    this.id = id;
    this.state = Array.from({ length: size }, () => 0);
  }

  public query(): number {
    return this.state.reduce((acc, value) => acc + value, 0);
  }

  public increment(num: number): void {
    if (num < 0) {
      throw new Error('Only positive values');
    }

    this.state[this.id] += num;
  }

  public merge(counter: GCounter) {
    const zipped = this.state.map((count, index) => [
      count,
      counter.state[index],
    ]);

    this.state = zipped.map((counts) => Math.max(counts[0], counts[1]));
  }
}
