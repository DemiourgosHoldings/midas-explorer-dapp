import * as React from 'react';
import { useGlobalState } from 'context';
import { Loader, ShardSpan, TransactionsTable, adapter } from 'sharedComponents';
import { TransactionRowType } from 'sharedComponents/TransactionsTable/TransactionRow';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import { useURLSearchParams } from 'helpers';

const Transactions = () => {
  const ref = React.useRef(null);

  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();

  const { page, senderShard, receiverShard } = useURLSearchParams();

  React.useEffect(() => {
    if (senderShard !== undefined || receiverShard !== undefined) {
      document.title = document.title.replace('Transactions', 'Shard Details');
    }
  }, [receiverShard, senderShard]);

  const { getTransactionsCount, getTransactions } = adapter();

  const [transactions, setTransactions] = React.useState<TransactionRowType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');
  const size = page !== undefined ? page : 1;

  const refreshFirstPage = size === 1 ? timestamp : 0;

  const fetchTransactions = () => {
    if (ref.current !== null) {
      getTransactions({
        size,
        senderShard,
        receiverShard,
      }).then(({ data, success }) => {
        if (ref.current !== null) {
          if (success) {
            setTransactions(data);
            setTransactionsFetched(true);
          } else if (transactions.length === 0) {
            setTransactionsFetched(false);
          }
        }
      });
      getTransactionsCount({
        senderShard,
        receiverShard,
      }).then(({ count, success }) => {
        if (ref.current !== null && success) {
          setTotalTransactions(Math.min(count, 10000));
        }
      });
    }
  };

  React.useEffect(fetchTransactions, [activeNetworkId, size, refreshFirstPage]); // run the operation only once since the parameter does not change

  return (
    <>
      {transactionsFetched === undefined && <Loader />}
      {transactionsFetched === false && <FailedTransactions />}

      <div ref={ref}>
        {transactionsFetched === true && (
          <div className="container py-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4">
                  <span data-testid="title">Transactions</span>
                  {senderShard !== undefined && (
                    <>
                      <span>&nbsp;from&nbsp;</span>
                      <ShardSpan shardId={senderShard} />
                    </>
                  )}
                  &nbsp;
                  {receiverShard !== undefined && (
                    <>
                      <span>to&nbsp;</span>
                      <ShardSpan shardId={receiverShard} />
                    </>
                  )}
                </h3>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                {transactions.length > 0 ? (
                  <TransactionsTable
                    transactions={transactions}
                    totalTransactions={totalTransactions}
                    size={size}
                  />
                ) : (
                  <div className="card">
                    <NoTransactions />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Transactions;
