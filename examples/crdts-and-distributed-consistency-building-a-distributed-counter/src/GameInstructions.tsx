import { CheckIcon, ClipboardCopyIcon } from '@heroicons/react/outline';

import { FC, useCallback, useState } from 'react';

type Props = {
  gameId: string;
  isHost: boolean;
  gameLink: string;
};

const GameInstructions: FC<Props> = ({ gameId, isHost, gameLink }: Props) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(gameLink).then(() => {
      setIsLinkCopied(true);

      setTimeout(() => {
        setIsLinkCopied(false);
      }, 1000);
    });
  }, [gameLink]);

  return (
    <div className="mx-auto text-center">
      <h2 className="text-3xl font-bold tracking-tight">
        <span className="block text-3xl text-streaver-gray">Welcome to the distributed count game!</span>
        <span className="block text-2xl text-streaver-blue">
          {isHost ? 'You are the host of this game!' : 'You are about to join a game'}
        </span>
        <span className="inline-flex justify-center text-sm text-streaver-gray">
          The game ID is: {gameId}
          <button onClick={handleCopyLink}>
            <div className="inline-flex w-20 space-x-1">
              {isLinkCopied ? (
                <>
                  <CheckIcon className="w-5 h-5 ml-3 -mr-1 text-gray-400" aria-hidden="true" /> <span>Copied!</span>
                </>
              ) : (
                <ClipboardCopyIcon className="w-5 h-5 ml-3 -mr-1 text-gray-400" aria-hidden="true" />
              )}
            </div>
          </button>
        </span>
      </h2>

      <div className="text-left">
        <h3 className="mt-2 text-xl font-bold">Objective</h3>

        <p>
          The objective is to get the most amount of keystrokes. But there is a catch, the keystrokes are required to be
          in balance. For each positive increment there must be a negative one.
        </p>

        <h4 className="mt-2 font-bold text-md">How to play</h4>

        <ul>
          <li>
            Use the <em>left arrow key to decrement</em>
          </li>
          <li>
            Use the <em>right arrow key to increment</em>
          </li>
          <li>
            You will have <em>15 seconds</em> once the host starts the game.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GameInstructions;
