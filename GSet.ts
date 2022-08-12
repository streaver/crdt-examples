export default class GSet<T> {
  public state: Set<T>;

  constructor() {
    this.state = new Set();
  }

  public query(): Set<T> {
    return this.state;
  }

  public add(element: T): void {
    this.state.add(element);
  }

  public merge(set: GSet<T>) {
    this.state = new Set([...this.state, ...set.state]);
  }
}
