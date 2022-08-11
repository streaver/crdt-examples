import GCounter from './GCounter';

export default class PNCounter {
  private positive: GCounter;
  private negative: GCounter;

  constructor(id: number, size: number) {
    this.positive = new GCounter(id, size);
    this.negative = new GCounter(id, size);
  }

  public query(): number {
    return this.positive.query() - this.negative.query();
  }

  public increment(num: number): void {
    this.positive.increment(num);
  }

  public decrement(num: number): void {
    this.negative.increment(num);
  }

  public merge(counter: PNCounter) {
    this.positive.merge(counter.positive);
    this.negative.merge(counter.negative);
  }
}
