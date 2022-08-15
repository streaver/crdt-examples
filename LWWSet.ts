import GSet from './GSet';

export default class LWWSet<T> {
  public a: GSet<T>;
  public at: Map<T, number>;

  public r: GSet<T>;
  public rt: Map<T, number>;

  constructor() {
    this.a = new GSet<T>();
    this.at = new Map<T, number>();

    this.r = new GSet<T>();
    this.rt = new Map<T, number>();
  }

  public query(): Set<T> {
    return new Set(
      [...this.a.query()].filter(
        (element) =>
          !this.r.query().has(element) ||
          this.at.get(element)! > this.rt.get(element)!,
      ),
    );
  }

  public add(element: T): void {
    this.a.add(element);
    this.at.set(element, Date.now());
  }

  public remove(element: T): void {
    this.r.add(element);
    this.rt.set(element, Date.now());
  }

  public merge(set: LWWSet<T>) {
    this.a.merge(set.a);
    this.r.merge(set.r);

    [...this.at.keys(), ...set.at.keys()].map((key) => {
      this.at.set(key, Math.max(this.at.get(key) ?? 0, set.at.get(key) ?? 0));
    });

    [...this.rt.keys(), ...set.rt.keys()].map((key) => {
      this.rt.set(key, Math.max(this.rt.get(key) ?? 0, set.rt.get(key) ?? 0));
    });
  }
}
