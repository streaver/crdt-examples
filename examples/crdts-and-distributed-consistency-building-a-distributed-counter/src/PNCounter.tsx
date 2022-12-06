import EventEmitter from 'events';
import GCounter, { GCounterId } from './GCounter';

export type PNCounterId = GCounterId;

export default class PNCounter extends EventEmitter {
  public positive: GCounter;
  public negative: GCounter;

  constructor(id: string | number, initialValue = 0) {
    super();

    this.positive = new GCounter(id, initialValue);
    this.negative = new GCounter(id, initialValue);
  }

  public query(): number {
    return this.positive.query() - this.negative.query();
  }

  public queryById(id: GCounterId): number {
    return this.positive.queryById(id)! - this.negative.queryById(id);
  }

  public increment(num: number): void {
    this.positive.increment(num);

    this.emit('increment');
    this.emit('change');
  }

  public decrement(num: number): void {
    this.negative.increment(num);

    this.emit('decrement');
    this.emit('change');
  }

  public merge(counter: PNCounter) {
    this.positive.merge(counter.positive);
    this.negative.merge(counter.negative);

    this.emit('merge');
    this.emit('change');
  }

  public static stringify(counter: PNCounter): string {
    return JSON.stringify({
      id: counter.positive.id,
      positive: [...counter.positive.state],
      negative: [...counter.negative.state],
    });
  }

  public static parse(string: string): PNCounter {
    const { id, positive: positiveState, negative: negativeState } = JSON.parse(string);

    const positive = new GCounter(id);
    const negative = new GCounter(id);

    positive.state = new Map<GCounterId, number>(positiveState);
    negative.state = new Map<GCounterId, number>(negativeState);

    const counter = new PNCounter(id);

    counter.positive = positive;
    counter.negative = negative;

    return counter;
  }
}
