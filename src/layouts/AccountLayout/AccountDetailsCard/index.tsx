import React, { useEffect, useRef, useState } from 'react';
import {
  faClock,
  faExclamationTriangle
} from '@fortawesome/pro-regular-svg-icons';
import {
  faUser,
  faCoins,
  faLayerGroup,
  faHexagonVerticalNft,
  faShieldCheck
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import {
  CardItem,
  CopyButton,
  Denominate,
  NetworkLink,
  ShardSpan,
  ScAddressIcon,
  Trim,
  TimeAgo,
  PropertyPill,
  SmallDetailItem,
  FormatUSD
} from 'components';
import { DECIMALS } from 'config';
import { isContract, urlBuilder, formatDate, formatHerotag } from 'helpers';
import { useAdapter } from 'hooks';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';

import { AccountUsdValueCardItem } from './AccountUsdValueCardItem';
import { LockedAmountCardItem } from './LockedAmountCardItem';

export const AccountDetailsCard = () => {
  const ref = useRef(null);

  const { account } = useSelector(accountSelector);
  const {
    address,
    balance,
    nonce,
    shard,
    ownerAddress,
    developerReward,
    deployedAt,
    scamInfo,
    isUpgradeable,
    isReadable,
    isPayable,
    isPayableBySmartContract,
    assets,
    username,
    txCount,
    isGuarded,
    activeGuardianAddress,
    activeGuardianServiceUid
  } = account;
  const { id: activeNetworkId, adapter } = useSelector(activeNetworkSelector);
  const { getProvider, getAccountTokensCount, getAccountNftsCount } =
    useAdapter();

  const [accountTokensCount, setAccountTokensCount] = useState<number>();
  const [accountNftsCount, setAccountNftsCount] = useState<number>();

  const tokensActive = adapter === 'api';
  const cardItemClass = tokensActive ? 'n4' : '';

  const [isProvider, setIsProvider] = useState(false);
  const fetchProviderDetails = () => {
    if (isContract(address)) {
      getProvider({ address }).then(({ success, data }) => {
        if (ref.current !== null) {
          if (success && data !== undefined) {
            setIsProvider(true);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchProviderDetails();
  }, [activeNetworkId, address]);

  const fetchAccountTokensCount = () => {
    if (tokensActive) {
      getAccountTokensCount({ address, includeMetaESDT: true }).then(
        (accountTokensCountData) => {
          if (ref.current !== null) {
            if (accountTokensCountData.success) {
              const accountTokens =
                typeof accountTokensCountData.data === 'number'
                  ? accountTokensCountData.data
                  : 0;

              setAccountTokensCount(accountTokens);
            }
          }
        }
      );
    }
  };
  const fetchAccountNftsCount = () => {
    if (tokensActive) {
      getAccountNftsCount({ address, excludeMetaESDT: true }).then(
        (accountNftsCountData) => {
          if (ref.current !== null) {
            if (accountNftsCountData.success) {
              const accountNfts =
                typeof accountNftsCountData.data === 'number'
                  ? accountNftsCountData.data
                  : 0;

              setAccountNftsCount(accountNfts);
            }
          }
        }
      );
    }
  };
  useEffect(() => {
    fetchAccountNftsCount();
    fetchAccountTokensCount();
  }, [txCount, activeNetworkId, address]);

  return address !== '' ? (
    <div ref={ref} className='row account-details-card mb-3'>
      {isContract(address) ? (
        <>
          <div className='col-12 col-lg-6 mb-3 mb-lg-0'>
            <div className='card h-100'>
              <div
                className={`card-header ${
                  scamInfo ? 'status-text-warning' : ''
                }`}
              >
                <div className='card-header-item d-flex align-items-center justify-content-between'>
                  <div className='d-flex align-items-center'>
                    <h5
                      className='mb-0 d-flex align-items-center'
                      data-testid='title'
                    >
                      Contract Details
                      {scamInfo && (
                        <span className='text-warning d-flex align-items-center ms-2'>
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            size='sm'
                            className='text-warning me-2'
                          />
                          {scamInfo.info}
                        </span>
                      )}
                    </h5>
                  </div>
                  {isProvider && (
                    <NetworkLink
                      to={urlBuilder.providerDetails(address)}
                      className='btn btn-sm btn-primary'
                    >
                      Provider Details
                    </NetworkLink>
                  )}
                </div>
              </div>
              <div className='card-body'>
                <SmallDetailItem title='Address'>
                  <div className='d-flex align-items-center'>
                    <ScAddressIcon initiator={address} />
                    <Trim text={address} />
                    <CopyButton text={address} />
                  </div>
                </SmallDetailItem>

                {assets?.name && (
                  <SmallDetailItem title='Name'>
                    <div className='d-flex align-items-center'>
                      {assets?.iconSvg && (
                        <div className='side-icon me-1'>
                          <img src={assets?.iconSvg} alt=' ' />
                        </div>
                      )}
                      <div>{assets.name}</div>
                    </div>
                  </SmallDetailItem>
                )}

                <SmallDetailItem title='Balance'>
                  <div className='d-flex align-items-center'>
                    {balance !== ELLIPSIS ? (
                      <Denominate value={balance} decimals={4} />
                    ) : (
                      balance
                    )}
                  </div>
                </SmallDetailItem>

                <SmallDetailItem title='Value'>
                  <FormatUSD
                    amount={balance}
                    decimals={DECIMALS}
                    digits={2}
                    showPrefix={false}
                  />
                </SmallDetailItem>

                <SmallDetailItem title='Properties'>
                  <div className='d-flex alig-items-center flex-wrap gap-2 mt-1 mt-lg-0'>
                    <PropertyPill
                      name={'Upgradeable'}
                      active={Boolean(isUpgradeable)}
                    />
                    <PropertyPill
                      name={'Readable'}
                      active={Boolean(isReadable)}
                    />
                    <PropertyPill
                      name={'Payable'}
                      active={Boolean(isPayable)}
                    />
                    <PropertyPill
                      name={'Payable by Smart Contract'}
                      active={Boolean(isPayableBySmartContract)}
                    />
                  </div>
                </SmallDetailItem>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6'>
            <div className='card h-100'>
              <div className='card-header'>
                <div className='card-header-item d-flex align-items-center'>
                  <h5 className='mb-0' data-testid='overview'>
                    Overview
                  </h5>
                </div>
              </div>
              <div className='card-body'>
                <SmallDetailItem title='Shard'>
                  {shard !== undefined ? (
                    <NetworkLink
                      to={urlBuilder.shard(shard)}
                      data-testid='shardLink'
                    >
                      <ShardSpan shard={shard} />
                    </NetworkLink>
                  ) : (
                    <span className='text-neutral-400'>N/A</span>
                  )}
                </SmallDetailItem>

                <SmallDetailItem title='Rewards'>
                  {developerReward !== undefined ? (
                    <Denominate value={developerReward} decimals={4} />
                  ) : (
                    <span className='text-neutral-400'>N/A</span>
                  )}
                </SmallDetailItem>

                <SmallDetailItem title='Owner'>
                  {ownerAddress !== undefined ? (
                    <div className='d-flex align-items-center'>
                      <ScAddressIcon initiator={ownerAddress} />
                      {ownerAddress !== address ? (
                        <NetworkLink
                          to={urlBuilder.accountDetails(ownerAddress)}
                          data-testid='ownerLink'
                          className='trim-wrapper'
                        >
                          <Trim text={ownerAddress} />
                        </NetworkLink>
                      ) : (
                        <Trim text={ownerAddress} />
                      )}
                      <CopyButton text={ownerAddress} />
                    </div>
                  ) : (
                    <span className='text-neutral-400'>N/A</span>
                  )}
                </SmallDetailItem>

                <SmallDetailItem title='Deployed'>
                  {deployedAt !== undefined ? (
                    <div className='d-flex align-items-center flex-wrap'>
                      <FontAwesomeIcon
                        icon={faClock}
                        className='me-2 text-neutral-400'
                      />
                      <TimeAgo value={deployedAt} /> ago &nbsp;
                      <span className='text-neutral-400'>
                        ({formatDate(deployedAt, false, true)})
                      </span>
                    </div>
                  ) : (
                    <span className='text-neutral-400'>N/A</span>
                  )}
                </SmallDetailItem>

                {assets?.description && (
                  <SmallDetailItem title='Description'>
                    <span
                      className='account-description'
                      title={assets.description}
                    >
                      {assets.description}
                    </span>
                  </SmallDetailItem>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='col'>
          <div className='card'>
            <div
              className={`card-header ${scamInfo ? 'status-text-warning' : ''}`}
            >
              <div className='card-header-item'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div className='d-flex align-items-center w-100'>
                    <h5 className='me-2 mb-0' data-testid='title'>
                      <div className='d-flex align-items-center'>
                        {assets?.iconSvg && (
                          <div className='side-icon me-1'>
                            <img src={assets?.iconSvg} alt=' ' />
                          </div>
                        )}
                        <div>{assets?.name ?? 'Address Details'}</div>
                      </div>
                    </h5>
                    {scamInfo && (
                      <span className='text-warning d-flex align-items-center ms-2'>
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          size='sm'
                          className='text-warning me-2'
                        />
                        {scamInfo.info}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='card-header-item compact card card-sm bg-table-header p-3 d-flex flex-column mt-3'>
                <div className='d-flex flex-row'>
                  <span className='text-neutral-400'>Address:</span>
                  <div className='d-flex align-items-center text-break-all ms-2'>
                    <span data-testid='address'>{address}</span>
                    <CopyButton text={address} />
                  </div>
                </div>
                {username && (
                  <div className='d-flex flex-row mt-2'>
                    <span className='text-neutral-400'>Herotag:</span>
                    <div className='d-flex align-items-center text-break-all ms-2'>
                      <span data-testid='address' title={username}>
                        {formatHerotag(username)}
                      </span>
                      <CopyButton text={formatHerotag(username)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='card-body card-item-container mx-spacing'>
              <CardItem
                className={cardItemClass}
                title='Balance'
                customIcon={<MultiversXSymbol />}
              >
                <div className='d-flex align-items-center'>
                  {balance !== ELLIPSIS ? (
                    <Denominate value={balance} decimals={4} />
                  ) : (
                    balance
                  )}
                </div>
              </CardItem>
              <LockedAmountCardItem cardItemClass={cardItemClass} />
              <AccountUsdValueCardItem cardItemClass={cardItemClass} />
              {isGuarded && (
                <CardItem
                  className={cardItemClass}
                  title={`Guardian ${
                    activeGuardianServiceUid
                      ? `(${activeGuardianServiceUid})`
                      : ''
                  }`}
                  icon={faShieldCheck}
                >
                  {activeGuardianAddress && (
                    <NetworkLink
                      to={urlBuilder.accountDetails(activeGuardianAddress)}
                      className='trim-wrapper'
                    >
                      <Trim text={activeGuardianAddress} />
                    </NetworkLink>
                  )}
                </CardItem>
              )}
              <CardItem className={cardItemClass} title='Nonce' icon={faUser}>
                {nonce !== undefined ? nonce.toLocaleString('en') : ELLIPSIS}
              </CardItem>
              {tokensActive && (
                <CardItem
                  className={cardItemClass}
                  title='Tokens'
                  icon={faCoins}
                >
                  {accountTokensCount !== undefined
                    ? accountTokensCount
                    : ELLIPSIS}
                </CardItem>
              )}
              {tokensActive && (
                <CardItem
                  className={cardItemClass}
                  title='NFTs'
                  icon={faHexagonVerticalNft}
                >
                  {accountNftsCount !== undefined ? accountNftsCount : ELLIPSIS}
                </CardItem>
              )}
              <CardItem
                className={cardItemClass}
                title='Shard'
                icon={faLayerGroup}
              >
                {shard !== undefined ? (
                  <NetworkLink
                    to={urlBuilder.shard(shard)}
                    data-testid='shardLink'
                  >
                    <ShardSpan shard={shard} />
                  </NetworkLink>
                ) : (
                  <>N/A</>
                )}
              </CardItem>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};
