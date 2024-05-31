import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ELLIPSIS } from 'appConstants';

import { FormatAmount } from 'components';
import { useGetRemainingTime } from 'hooks';
import { faClock } from 'icons/solid';
import { stakeSelector, statsSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export const NodesEpochStatusCards = ({ className }: WithClassnameType) => {
  const { isFetched: isStakeFetched, unprocessed } = useSelector(stakeSelector);
  const {
    isFetched: isStatsFetched,
    unprocessed: { epochTimeRemaining: unprocessedEpochTimeRemaining },
    epoch
  } = useSelector(statsSelector);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const currentTimestamp = useMemo(
    () => moment().unix() + unprocessedEpochTimeRemaining / 1000,
    [refreshTrigger]
  );
  const remainingTime = useGetRemainingTime({
    timeData: currentTimestamp,
    onCountdownEnd: () => {
      setTimeout(() => {
        setRefreshTrigger(moment().unix());
        return;
      }, 500);
    }
  });

  const [_omit, hours, minutes, seconds] = remainingTime;

  if (!isStakeFetched) {
    return null;
  }

  return (
    <div
      className={classNames(
        'epoch-status-cards d-flex flex-column gap-3 h-100',
        className
      )}
    >
      <div className='card bg-neutral-800-opacity-60 flex-fill'>
        <div className='card-body py-3 d-flex align-items-center'>
          <div className='d-flex w-100 flex-wrap gap-1 gap-sm-3 align-items-start justify-content-between'>
            <div className='text-primary-100'>
              <FontAwesomeIcon icon={faClock} className='me-2' />
              {epoch !== undefined ? (
                <>Epoch {new BigNumber(epoch).toFormat(0)}</>
              ) : (
                ELLIPSIS
              )}{' '}
              ends in
            </div>
            <h3 className='mb-0 text-primary text-lh-24'>
              {isStatsFetched ? (
                <>
                  <span className='time-container'>{hours.time}</span>h{' '}
                  <span className='time-container'>{minutes.time}</span>
                  min <span className='time-container'>{seconds.time}</span>
                  sec
                </>
              ) : (
                ELLIPSIS
              )}
            </h3>
          </div>
        </div>
      </div>
      {unprocessed.minimumAuctionQualifiedStake && (
        <div className='card bg-neutral-800-opacity-60 flex-fill'>
          <div className='card-body py-3 d-flex align-items-center'>
            <div className='d-flex w-100 flex-wrap gap-1 gap-sm-3 align-items-start justify-content-between'>
              <div className='text-neutral-500'>
                Node Qualification Threshold
              </div>
              <h3 className='mb-0 text-lh-24'>
                <FormatAmount
                  value={unprocessed.minimumAuctionQualifiedStake}
                  digits={4}
                  superSuffix
                />
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
