import * as React from 'react';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loader, useAdapter, PageState } from 'components';
import { txStatus } from 'components/TransactionStatus/txStatus';
import { refreshSelector } from 'redux/selectors/refresh';
import { TransactionType } from 'types';
import { TransactionInfo } from './TransactionInfo';

export const TransactionDetails = () => {
  const params: any = useParams();
  const { hash: transactionId } = params;
  const ref = React.useRef(null);

  const { timestamp } = useSelector(refreshSelector);

  const { getTransaction } = useAdapter();

  const [transaction, setTransaction] = React.useState<
    TransactionType | undefined
  >();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTransaction = () => {
    if (transactionId) {
      getTransaction(transactionId).then(({ data, success }) => {
        if (ref.current !== null) {
          setTransaction(data);
          setDataReady(success);
        }
      });
    }
  };

  const checkRefetch = () => {
    if (
      transaction &&
      (transaction.status.toLowerCase() === txStatus.pending.toLowerCase() ||
        transaction.pendingResults) &&
      dataReady
    ) {
      fetchTransaction();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchTransaction, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(checkRefetch, [timestamp]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faExchangeAlt}
          title='Unable to locate this transaction hash'
          description={
            <div className='px-spacer'>
              <span className='text-break-all'>{transactionId}</span>
            </div>
          }
          className='py-spacer my-auto'
          data-testid='errorScreen'
        />
      )}
      <div ref={ref}>
        {dataReady === true && transaction && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <TransactionInfo transaction={transaction} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
