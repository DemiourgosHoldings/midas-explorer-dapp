import { ExpandRowDetailsType } from 'helpers/getValue/getExpandRowDetails';
import { useGetSort } from 'hooks';
import { NodeType, SortOrderEnum, WithClassnameType } from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { AuctionListExpandRow } from './AuctionListExpandRow';
import { AuctionListTresholdRow } from './AuctionListTresholdRow';

export interface AuctionListRowUIType extends WithClassnameType {
  nodeData: NodeType;
  showTresholdRow?: boolean;
  expandRowDetails?: ExpandRowDetailsType;
  index?: number;
  showPosition?: boolean;
}

export const AuctionListRow = ({
  nodeData,
  showTresholdRow,
  index,
  showPosition,
  expandRowDetails
}: AuctionListRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'auctionPosition' && order === SortOrderEnum.desc;

  const hasExpand = Boolean(
    expandRowDetails?.qualifiedExpandPosition ||
      expandRowDetails?.dangerZoneExpandPosition ||
      expandRowDetails?.notQualifiedExpandPosition
  );

  return (
    <>
      {isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} isSortDesc />
      )}
      {hasExpand && index && expandRowDetails ? (
        <AuctionListExpandRow
          nodeData={nodeData}
          expandRowDetails={expandRowDetails}
          showPosition={showPosition}
          index={index}
        />
      ) : (
        <AuctionListBaseRow
          nodeData={nodeData}
          index={index}
          showPosition={showPosition}
        />
      )}
      {!isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} />
      )}
    </>
  );
};
