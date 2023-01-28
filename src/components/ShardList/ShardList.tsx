import React from 'react';

import { useSelector } from 'react-redux';
import { useFetchShards } from 'hooks';
import { shardsSelector, globalStakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

import { ShardCard } from './ShardCard';

export const ShardList = ({ className }: WithClassnameType) => {
  const shards = useSelector(shardsSelector);
  const { queueSize } = useSelector(globalStakeSelector);
  useFetchShards();

  return (
    <div className={`shard-list ${className ?? ''}`}>
      {shards.map((shard, i) => (
        <React.Fragment key={shard.shard + i}>
          <ShardCard shard={shard} />
        </React.Fragment>
      ))}
      <ShardCard customTitle='Queue' customValue={queueSize} />
    </div>
  );
};
