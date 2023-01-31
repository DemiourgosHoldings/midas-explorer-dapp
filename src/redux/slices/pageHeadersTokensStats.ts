import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HeadersTokensType } from '../../types/headerStats.types';

export const getInitialHeaderTokensStatsState = (): HeadersTokensType => {
  return {};
};

export const pageHeadersCollectionsStatsSlice = createSlice({
  name: 'pageHeadersTokensStatsSlice',
  initialState: getInitialHeaderTokensStatsState(),
  reducers: {
    setPageHeaderTokensStats: (
      state: HeadersTokensType,
      action: PayloadAction<HeadersTokensType>
    ) => {
      state.totalTokens = action.payload.totalTokens;
      state.tokenTransfersInLast30d = action.payload.tokenTransfersInLast30d;
      state.newTokensInLast30d = action.payload.newTokensInLast30d;
      state.ecosystemMarketCap = action.payload.ecosystemMarketCap;
    }
  }
});

export const { setPageHeaderTokensStats } =
  pageHeadersCollectionsStatsSlice.actions;

export const pageHeadersTokensReducer =
  pageHeadersCollectionsStatsSlice.reducer;
