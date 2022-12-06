import { isEqual } from 'lodash';
import { useCallback, useRef, useSyncExternalStore } from 'react';
import PNCounter, { PNCounterId } from './PNCounter';
import usePNCounter from './usePNCounter';

export default function usePNCounterSelector<T>(id: PNCounterId, selector: (counter: PNCounter) => T): T {
  const counter = usePNCounter(id);

  const subscribeToCounter = useCallback(
    (callback: () => void) => {
      counter.on('change', callback);
      return () => {
        counter.off('change', callback);
      };
    },
    [counter],
  );

  const previousValue = useRef<T>(selector(counter));

  const getSnapshot = useCallback(() => {
    const newCandidateValue = selector(counter);
    const newValue = isEqual(newCandidateValue, previousValue.current) ? previousValue.current : newCandidateValue;

    previousValue.current = newValue;

    return newValue;
  }, [counter, selector]);

  return useSyncExternalStore(subscribeToCounter, getSnapshot, getSnapshot);
}
