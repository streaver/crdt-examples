import ExamplesLayout from 'components/layouts/ExamplesLayout';

import { nanoid } from 'nanoid';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { CustomNextPage } from 'pages/_app.page';
import GameControls from './src/GameControls';
import GameInstructions from './src/GameInstructions';
import GameScore from './src/GameScore';
import ParticipantsList from './src/ParticipantsList';

export const gameIdQueryKey = 'gameId';

type PageProps = {
  gameId: string;
  hostId: string;
  peerId: string;
  isHost: boolean;
  gameLink: string;
};

const CRDTsAndDistributedConsistencyBuildingADistributedCounter: CustomNextPage<PageProps> = ({
  gameId,
  hostId,
  peerId,
  isHost,
  gameLink,
}: PageProps) => {
  return (
    <>
      <NextSeo noindex nofollow />

      <div className="flex flex-col px-2 py-2 bg-white divide-x-2 md:divide-x-0 md:flex-row">
        <div className="w-full m-auto md:w-1/2">
          <GameInstructions gameId={gameId} gameLink={gameLink} isHost={isHost} />
          <GameControls hostId={hostId} peerId={peerId} isHost={isHost} />
        </div>

        <div className="w-full mx-auto md:w-1/2">
          <GameScore peerId={peerId} />
          <div className="mt-5">
            <ParticipantsList peerId={peerId} />
          </div>
        </div>
      </div>
    </>
  );
};

CRDTsAndDistributedConsistencyBuildingADistributedCounter.Layout = ExamplesLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    query: { gameId, isHost },
    resolvedUrl,
    req: {
      headers: { host },
    },
  } = context;

  const resolvedGameId = gameId?.toString() || btoa(nanoid());
  const path = resolvedUrl.split('?')[0];
  const gameLink = `http://${host}${path}?${gameIdQueryKey}=${resolvedGameId}`;
  const resolvedIsHost = isHost?.toString() === 'true' || !gameId;

  if (resolvedIsHost && (!gameId || !isHost)) {
    return {
      redirect: {
        destination: `${gameLink}&isHost=true`,
        permanent: false,
      },
    };
  }

  const hostId = atob(resolvedGameId);
  const peerId = isHost ? hostId : nanoid();

  return {
    props: {
      gameId: resolvedGameId,
      hostId,
      peerId,
      isHost: resolvedIsHost,
      gameLink,
    },
  };
};

export default CRDTsAndDistributedConsistencyBuildingADistributedCounter;
