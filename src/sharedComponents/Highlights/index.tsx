import React from 'react';
import { useGlobalState } from '../../context';
import { getStats } from './helpers/asyncRequests';
import DefaultHighlights from './DefaultHighlights';
import HeroHighlights from './HeroHighlights';

export type StateType = {
  blockNumber: string;
  nrOfNodes: string;
  nrOfShards: string;
  roundNumber: string;
  liveTPS: string;
  peakTPS: string;
  totalProcessedTxCount: string;
};

const initialState = {
  blockNumber: '...',
  nrOfNodes: '...',
  nrOfShards: '...',
  roundNumber: '...',
  liveTPS: '...',
  peakTPS: '...',
  totalProcessedTxCount: '...',
};

const Hightlights = ({
  hero = false,
  setLiveTps = () => {},
}: {
  hero?: boolean;
  setLiveTps?: Function;
}) => {
  const {
    activeTestnet: { elasticUrl },
    timeout,
    refresh: { timestamp },
  } = useGlobalState();
  const [state, setState] = React.useState<StateType>(initialState);
  let ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current !== null) {
      getStats({ elasticUrl, timeout }).then(({ data, success }) => {
        const newState = success
          ? {
              blockNumber: parseInt(data.blockNumber).toLocaleString('en'),
              nrOfNodes: parseInt(data.nrOfNodes).toLocaleString('en'),
              nrOfShards: parseInt(data.nrOfShards).toLocaleString('en'),
              roundNumber: parseInt(data.roundNumber).toLocaleString('en'),
              liveTPS: parseInt(data.liveTPS).toLocaleString('en'),
              peakTPS: parseInt(data.peakTPS).toLocaleString('en'),
              totalProcessedTxCount: parseInt(data.totalProcessedTxCount).toLocaleString('en'),
            }
          : initialState;

        ref.current !== null && setLiveTps(newState.liveTPS);

        ref.current !== null && setState(newState);
      });
    }
  }, [elasticUrl, timeout, timestamp, setLiveTps]); // run the operation only once since the parameter does not change

  return (
    <div ref={ref}>{!hero ? <DefaultHighlights {...state} /> : <HeroHighlights {...state} />}</div>
  );
};

export default Hightlights;
