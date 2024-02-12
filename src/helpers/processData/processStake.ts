import BigNumber from 'bignumber.js';

import { DECIMALS, DIGITS } from 'config';
import { denominate } from 'helpers';
import { StakeType } from 'types/stake.types';

export const processStake = (data: StakeType) => {
  return {
    totalValidators: new BigNumber(data.totalValidators).toFormat(0),
    activeValidators: new BigNumber(data.activeValidators).toFormat(0),
    totalStaked: denominate({
      input: data.totalStaked,
      denomination: DECIMALS,
      decimals: DIGITS,
      showLastNonZeroDecimal: false,
      addCommas: false
    }),
    ...(data.nakamotoCoefficient !== undefined
      ? {
          nakamotoCoefficient: new BigNumber(data.nakamotoCoefficient).toFormat(
            0
          )
        }
      : {}),
    ...(data.queueSize !== undefined
      ? {
          queueSize: new BigNumber(data.queueSize).toFormat(0)
        }
      : {}),

    ...(data.minimumAuctionQualifiedTopUp !== undefined
      ? {
          minimumAuctionQualifiedTopUp: denominate({
            input: data.minimumAuctionQualifiedTopUp,
            denomination: DECIMALS,
            decimals: DIGITS,
            showLastNonZeroDecimal: false,
            addCommas: false
          })
        }
      : {}),
    ...(data.minimumAuctionQualifiedStake !== undefined
      ? {
          minimumAuctionQualifiedStake: denominate({
            input: data.minimumAuctionQualifiedStake,
            denomination: DECIMALS,
            decimals: DIGITS,
            showLastNonZeroDecimal: false,
            addCommas: false
          })
        }
      : {}),
    ...(data.auctionValidators !== undefined
      ? {
          auctionValidators: new BigNumber(data.auctionValidators).toFormat(0)
        }
      : {}),
    ...(data.eligibleValidators !== undefined
      ? {
          eligibleValidators: new BigNumber(data.eligibleValidators).toFormat(0)
        }
      : {}),
    ...(data.dangerZoneValidators !== undefined
      ? {
          dangerZoneValidators: new BigNumber(
            data.dangerZoneValidators
          ).toFormat(0)
        }
      : {}),
    ...(data.waitingValidators !== undefined
      ? {
          waitingValidators: new BigNumber(data.waitingValidators).toFormat(0)
        }
      : {})
  };
};
