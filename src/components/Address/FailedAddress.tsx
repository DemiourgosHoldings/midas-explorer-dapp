import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { faWallet } from '@fortawesome/pro-regular-svg-icons/faWallet';
import React from 'react';
import { numInitCharactersForScAddress } from 'appConfig';
import { PageState } from 'sharedComponents';

export default function FailedAddress({ addressId }: { addressId: string | undefined }) {
  const showIcon =
    numInitCharactersForScAddress > 0 &&
    String(addressId).startsWith('0'.repeat(numInitCharactersForScAddress));

  return (
    <PageState
      icon={showIcon ? faCode : faWallet}
      title="Unable to locate this address hash"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{addressId}</span>
        </div>
      }
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
