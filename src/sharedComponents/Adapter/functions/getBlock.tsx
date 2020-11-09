import { AdapterFunctionType } from './index';

interface SearchCallType {
  shardId: number;
  epoch: number;
  blockId?: string;
}

async function searchCall({
  provider,
  baseUrl,
  timeout,
  shardId,
  epoch,
}: AdapterFunctionType & SearchCallType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/validators/${shardId}_${epoch}`,
      timeout,
    });

    return data;
  } catch {
    return [];
  }
}

interface GetNextBlockType {
  currentBlockId: number;
  currentShardId: number;
}

async function getNextBlock({
  provider,
  baseUrl,
  currentBlockId,
  currentShardId,
  timeout,
}: AdapterFunctionType & GetNextBlockType) {
  const nextBlockId = currentBlockId + 1;
  try {
    const { data } = await provider({
      baseUrl,
      url: `/blocks`,
      params: {
        nonce: nextBlockId,
        shardId: currentShardId,
      },
      timeout,
    });

    return data[0] ? data[0].hash : '';
  } catch {
    return '';
  }
}

export default async function getBlock({
  provider,
  baseUrl,
  timeout,
  blockId = '',
}: AdapterFunctionType & { blockId: string }) {
  try {
    const { data: block } = await provider({
      baseUrl,
      url: `/blocks/${blockId}`,
      timeout,
    });

    const hit = await searchCall({
      provider,
      baseUrl,
      timeout,
      shardId: block.shardId,
      epoch: block.epoch,
    });

    const consensusArray = Object.keys(hit).length ? hit.publicKeys : [];

    const consensusItems = consensusArray.length
      ? block.validators.map((id: any) => consensusArray[id])
      : [];

    const nextHash = await getNextBlock({
      provider,
      baseUrl,
      currentBlockId: block.nonce,
      currentShardId: block.shardId,
      timeout,
    });

    return {
      block,
      proposer: consensusItems.length ? [...consensusItems].shift() : '',
      consensusItems,
      nextHash,
      success: true,
    };
  } catch {
    return { success: false };
  }
}
