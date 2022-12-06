import PNCounter, { PNCounterId } from './PNCounter';

const counters = new Map<PNCounterId, PNCounter>();

const createCounter = (id: PNCounterId) => {
  const newCounter = new PNCounter(id);

  counters.set(id, newCounter);

  return newCounter;
};

export default function usePNCounter(id: PNCounterId): PNCounter {
  const counter: PNCounter = counters.has(id) ? counters.get(id)! : createCounter(id);

  return counter;
}
