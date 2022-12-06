import { DataConnection } from 'peerjs';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import PNCounter from './PNCounter';
import usePNCounter from './usePNCounter';
import usePNCounterSelector from './usePNCounterSelector';

type Props = {
  hostId: string;
  peerId: string;
  isHost: boolean;
};

let didInit = false;

const GameControls: FC<Props> = ({ hostId, peerId, isHost }: Props) => {
  const counter = usePNCounter(peerId);
  const [isGameReady, setIsGameReady] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const connectionsRef = useRef<DataConnection[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const clientIds = usePNCounterSelector(peerId, (counter) => [...counter.positive.state.keys()]);
  const winnerId = usePNCounterSelector(peerId, (counter) => {
    const ids = [...counter.positive.state.keys()];

    const calculateMax = (id: string | number) => counter.query() - counter.queryById(id);

    let winnerId = ids[0];
    let max = calculateMax(winnerId);

    ids.forEach((id) => {
      if (calculateMax(id) > max) {
        max = calculateMax(id);
        winnerId = id;
      }
    });

    return winnerId;
  });

  const handleJoinGame = useCallback(async () => {
    const { default: Peer } = await import('peerjs');
    const peer = new Peer(peerId);

    const addConnection = (peerId: string, cb: (conn: DataConnection) => void) => {
      const conn = peer.connect(peerId);

      conn.on('open', () => {
        console.log('Connected to peer', peerId);

        connectionsRef.current.push(conn);

        cb(conn);
      });
    };

    await new Promise<void>((resolve) => {
      peer.on('open', () => resolve());
    });

    peer.on('connection', (conn) => {
      setIsGameReady(true);

      conn.on('data', (data: any) => {
        if (isHost && data.type === 'peer-exchange') {
          addConnection(data.peerId, (conn) => conn.send(PNCounter.stringify(counter)));
        } else if (data.type === 'start-game') {
          setRemainingTime(data.counter);
          setIsGameStarted(data.counter === 3);
        } else if (data.type !== 'peer-exchange') {
          const received = PNCounter.parse(data);

          counter.merge(received);
        }
      });
    });

    if (!isHost) {
      addConnection(hostId, (conn) => {
        conn.send({
          type: 'peer-exchange',
          peerId: peer.id,
        });
      });
    }

    let debounceId: NodeJS.Timeout | undefined;
    let changes = 0;

    counter.on('change', () => {
      if (changes % 10 === 0) {
        debounceId = setTimeout(() => {
          connectionsRef.current.forEach((conn) => {
            conn.send(PNCounter.stringify(counter));
          });
        }, 250);
      } else {
        if (debounceId) {
          clearTimeout(debounceId);
          debounceId = undefined;
        }
      }
    });
  }, [counter, hostId, isHost, peerId]);

  const handleStartGame = useCallback(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((c) => {
        connectionsRef.current.forEach((conn) => {
          conn.send({
            type: 'start-game',
            counter: c,
          });
        });

        if (c === 3) {
          clearInterval(intervalId);
          return c;
        }

        return c + 1;
      });
    }, 1000);

    setIsGameStarted(true);
  }, []);

  useEffect(() => {
    if (isHost && !didInit) {
      handleJoinGame();
      didInit = true;
    }
  }, [handleJoinGame, isHost]);

  useEffect(() => {
    if (remainingTime === 3) {
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'ArrowLeft') {
          counter.decrement(1);
        } else if (e.code === 'ArrowRight') {
          counter.increment(1);
        }
      };

      window.addEventListener('keyup', handleKeyUp);

      setTimeout(() => {
        window.removeEventListener('keyup', handleKeyUp);
        setIsGameStarted(false);
      }, 15 * 1000);

      return () => window.removeEventListener('keyup', handleKeyUp);
    }
  }, [counter, remainingTime]);

  return (
    <div className="px-4 pt-12 mx-auto text-center max-w-7xl">
      <div className="flex justify-center min-h-[75px]">
        <div>
          {isHost && clientIds.length < 2 && <p>Waiting for others to join</p>}
          {!isHost && isGameReady && remainingTime === 0 && <p>Waiting for the host to start the game</p>}

          {isHost && remainingTime === 0 && clientIds.length >= 2 && (
            <button
              onClick={handleStartGame}
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Start game
            </button>
          )}

          {!isGameReady && !isHost && !isGameStarted && (
            <button
              onClick={handleJoinGame}
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Join game
            </button>
          )}

          {remainingTime > 0 && remainingTime !== 3 && (
            <p className="text-3xl font-bold">Starting in {remainingTime}!</p>
          )}

          {isGameStarted && remainingTime === 3 && <p className="text-3xl font-bold">Go!</p>}
          {!isGameStarted && remainingTime === 3 && <p className="text-3xl font-bold">This winner is {winnerId}</p>}
        </div>
      </div>
    </div>
  );
};

export default GameControls;
