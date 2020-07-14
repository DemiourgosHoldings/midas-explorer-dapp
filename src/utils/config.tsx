export default {
  metaChainShardId: 4294967295,
  elrondApps: [
    { id: 'main-site', name: 'Main site', to: 'https://elrond.com/' },
    { id: 'wallet', name: 'Wallet', to: 'https://wallet.elrond.com/' },
    { id: 'staking', name: 'Staking', to: 'https://genesis.elrond.com' },
    { id: 'pre-staking', name: 'Pre-staking', to: 'https://stake.elrond.com' },
    { id: 'explorer', name: 'Explorer', to: 'https://explorer.elrond.com/' },
    { id: 'docs', name: 'Docs', to: 'https://docs.elrond.com/' },
  ],
  explorerApi: 'https://explorer-api.elrond.com',
  testnets: [
    {
      default: true,
      id: 'battle-of-nodes',
      name: 'Battle of Nodes',
      numInitCharactersForScAddress: 20,
      nodeUrl: 'https://api.elrond.com',
      refreshRate: 6000,
      elasticUrl: 'https://api-facade.elrond.com',
      decimals: 4,
      denomination: 18,
      gasPrice: 200000000000,
      gasLimit: 50000,
      gasPerDataByte: 1500,
      gasLimitEditable: true,
      economics: true,
      data: true,
      wallet: true,
      validatorDetails: true,
      faucet: false,
      nrOfShards: 5,
      versionNumber: 'v1.0.123',
      fetchedFromNetworkConfig: true,
    },
  ],
};
