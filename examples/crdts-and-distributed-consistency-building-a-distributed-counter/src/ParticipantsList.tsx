import classNames from 'classnames';
import { motion } from 'framer-motion';

import { FC } from 'react';
import { GCounterId } from './GCounter';
import usePNCounterSelector from './usePNCounterSelector';

type ParticipantProps = {
  peerId: string;
  clientId: GCounterId;
};

const Participant: FC<ParticipantProps> = ({ peerId, clientId }: ParticipantProps) => {
  const count = usePNCounterSelector(peerId, (counter) => counter.queryById(clientId));

  return (
    <li className="m-auto mb-2">
      <p
        className={classNames('text-sm font-medium text-gray-900', {
          'font-bold': clientId === peerId,
        })}
      >
        {clientId} {clientId === peerId ? '(You)' : ''}
      </p>

      <motion.div
        className="m-auto"
        initial={{ width: '150px', backgroundColor: '#FFFFFF' }}
        animate={{
          backgroundColor: count > 0 ? '#86EEAC' : count === 0 ? '#FFFFFF' : '#FCA5A5',
          width: `${150 + count * 10}px`,
          transition: {
            duration: 0.15,
          },
        }}
      >
        {count}
      </motion.div>
    </li>
  );
};

type ParticipantsListProps = {
  peerId: string;
};

const ParticipantsList: FC<ParticipantsListProps> = ({ peerId }: ParticipantsListProps) => {
  const clientIds = usePNCounterSelector(peerId, (counter) => [...counter.positive.state.keys()]);

  return (
    <ul role="list" className="w-1/3 m-auto text-center">
      {clientIds.map((clientId) => (
        <Participant key={clientId} peerId={peerId} clientId={clientId} />
      ))}
    </ul>
  );
};

export default ParticipantsList;
