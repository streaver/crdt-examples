export type GCounterId = number | string;

export default class GCounter {
  public readonly id: GCounterId;
  public state: Map<GCounterId, number>;

  constructor(id: GCounterId, initialValue = 0) {
    this.id = id;
    this.state = new Map();

    this.state.set(id, initialValue);
  }

  public query(): number {
    return [...this.state.values()].reduce((acc, value) => acc + value, 0);
  }

  public queryById(id: GCounterId): number {
    return this.state.get(id)!;
  }

  public increment(num: number): void {
    if (num < 0) {
      throw new Error('Only positive values');
    }

    this.state.set(this.id, this.state.get(this.id)! + num);
  }

  public merge(counter: GCounter) {
    const ids = [...new Set([...this.state.keys(), ...counter.state.keys()])];

    const zipped = ids.map((id) => [this.state.get(id) ?? 0, counter.state.get(id) ?? 0]);

    this.state = new Map(ids.map((id, index) => [id, Math.max(zipped[index][0], zipped[index][1])]));
  }
}
