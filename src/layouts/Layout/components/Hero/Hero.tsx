import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { FormattedValue, Search } from 'components';
import {
  useActiveRoute,
  useIsMainnet,
  usePageStats,
  useGetSubdomainNetwork
} from 'hooks';
import { ChartContractsTransactions } from 'pages/Home/components/ChartContractsTransactions';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';
import { analyticsRoutes } from 'routes';
import {
  AccountsStatsCard,
  BlockHeightStatsCard,
  TransactionsStatsCard,
  ValidatorsStatusCard,
  HeroPills,
  StatsCard,
  HeroHome,
  HeroNodes
} from 'widgets';

import {
  useShowCustomStats,
  useShowGlobalStats,
  useShowNodesStats,
  useShowTransactionStats
} from './hooks';
import { getCustomPageName } from '../../helpers';

export const Hero = () => {
  const { pathname } = useLocation();
  const subdomainNetwork = useGetSubdomainNetwork();
  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const { pageStats } = usePageStats();

  const isHome = activeRoute('/');
  const isAnalytics =
    activeRoute(analyticsRoutes.analytics) ||
    activeRoute(analyticsRoutes.compare);
  const showCustomStats = useShowCustomStats() && isMainnet;
  const showGlobalStats = useShowGlobalStats();
  const showNodesStats = useShowNodesStats();
  const showTransactionsStats = useShowTransactionStats() && isMainnet;

  const pathArray = pathname.split('/').filter((path) => path);

  const basePage =
    activeNetworkId !== defaultNetworkId &&
    pathArray.length > 1 &&
    !subdomainNetwork
      ? pathArray?.[1]
      : pathArray?.[0];

  const pageName = getCustomPageName({ pathname, basePage });

  let heroTypeClassName = '';
  if (showTransactionsStats && !showCustomStats) {
    heroTypeClassName = 'transactions-stats';
  }
  if (showNodesStats) {
    heroTypeClassName = 'nodes-stats';
  }

  return (
    <div className='container'>
      {isHome ? (
        <HeroHome />
      ) : (
        <div className='row main-search-container mt-3'>
          <div className='col-12 col-lg-5 col-xl-6'>
            <Search className='input-group-black' />
          </div>
          <div className='col-12 col-lg-7 col-xl-6'>
            <HeroPills />
          </div>
        </div>
      )}

      {showGlobalStats && (
        <div
          className={`page-hero card card-lg card-black mb-3 ${heroTypeClassName}`}
        >
          <div className='card-header'>
            <h2 className='title mb-0 text-capitalize'>
              {isAnalytics ? (
                <>
                  {`MultiversX Blockchain ${pageName}`}{' '}
                  <span className='text-neutral-500'> (Beta)</span>
                </>
              ) : (
                <>{pageName}</>
              )}
            </h2>
          </div>
          {showCustomStats ? (
            <div className='card-body'>
              <div className='d-flex flex-row flex-wrap gap-3 custom-stats'>
                {pageStats?.data.map((item) => (
                  <StatsCard
                    key={item.id}
                    title={item.title}
                    subTitle={item.subTitle}
                    icon={item.icon}
                    value={<FormattedValue value={item.value} />}
                    className='card-solitary'
                  />
                ))}
              </div>
              {showTransactionsStats && (
                <div className='card mt-3'>
                  <ChartContractsTransactions
                    showStatistics={false}
                    title='App transactions'
                    showTransactions={false}
                    showTotal={false}
                    simpleTooltip={true}
                    className='bg-neutral-900'
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              {showTransactionsStats && (
                <div className='card-body p-0'>
                  <ChartContractsTransactions />
                </div>
              )}

              {showNodesStats && <HeroNodes />}

              {!(showTransactionsStats || showNodesStats) && (
                <div className='card-body d-flex flex-row flex-wrap gap-3'>
                  <TransactionsStatsCard />
                  <AccountsStatsCard />
                  <BlockHeightStatsCard />
                  {isMainnet && <ValidatorsStatusCard isSmall />}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
