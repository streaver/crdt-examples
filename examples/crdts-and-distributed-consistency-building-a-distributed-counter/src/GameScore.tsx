import { FC } from 'react';
import usePNCounterSelector from './usePNCounterSelector';

type Props = {
  peerId: string;
};

const GameScore: FC<Props> = ({ peerId }: Props) => {
  const score = usePNCounterSelector(peerId, (counter) => Math.min(counter.positive.query(), counter.negative.query()));

  return <p className="text-3xl text-center">Score {score}</p>;
};

export default GameScore;
