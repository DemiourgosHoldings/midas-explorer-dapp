import React from 'react';
import { useGlobalState } from '../../context';
import DefaultHighlights from './DefaultHighlights';
import { getStats } from './helpers/asyncRequests';
import HeroHighlights from './HeroHighlights';

export interface StateType {
  blockNumber: string;
  nrOfNodes: string;
  nrOfShards: string;
  roundNumber: string;
  liveTPS: string;
  peakTPS: string;
  totalProcessedTxCount: string;
}

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
  setLiveTps = () => {
    return;
  },
}: {
  hero?: boolean;
  setLiveTps?: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {
    activeTestnet: { elasticUrl },
    activeTestnetId,
    timeout,
    refresh: { timestamp },
  } = useGlobalState();

  const [state, setState] = React.useState<StateType>(initialState);
  const [oldTestnetId, setOldTestnetId] = React.useState<string>('');
  const ref = React.useRef(null);

  React.useEffect(() => {
    setOldTestnetId(activeTestnetId);
  }, [activeTestnetId]);

  const getHighlights = () => {
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
        if (ref.current !== null) {
          const sameTestnet = oldTestnetId === activeTestnetId;
          if (success || (!success && !sameTestnet)) {
            setLiveTps(newState.liveTPS);
            setState(newState);
          }
        }
      });
    }
  };

  React.useEffect(getHighlights, [elasticUrl, timeout, timestamp]); // run the operation only once since the parameter does not change

  return (
    <div ref={ref}>{!hero ? <DefaultHighlights {...state} /> : <HeroHighlights {...state} />}</div>
  );
};

export default Hightlights;
