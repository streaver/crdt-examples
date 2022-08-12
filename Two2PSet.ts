import GSet from './GSet';

export default class TwoPSet<T> {
  public a: GSet<T>;
  public r: GSet<T>;

  constructor() {
    this.a = new GSet<T>();
    this.r = new GSet<T>();
  }

  public query(): Set<T> {
    return new Set(
      [...this.a.query()].filter((element) => !this.r.query().has(element)),
    );
  }

  public add(element: T): void {
    this.a.add(element);
  }

  public remove(element: T): void {
    this.r.add(element);
  }

  public merge(set: TwoPSet<T>) {
    this.a.merge(set.a);
    this.r.merge(set.r);
  }
}
