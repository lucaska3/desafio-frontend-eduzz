import React, { memo, useCallback, useState } from 'react';
import { take } from 'rxjs/operators';
import cryptoService from 'services/crypto';

import CurrencyCard from './';

interface IProps {
  reload?: boolean;
}

const BalanceBtc = memo((props: IProps) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateData = useCallback(() => {
    setLoading(true);
    const balanceBtcSubscription = cryptoService
      .balance()
      .pipe(take(1))
      .subscribe(data => {
        setBalance(data);
        setLoading(false);
      });
    return () => balanceBtcSubscription.unsubscribe();
  }, []);

  return (
    <CurrencyCard
      title='Saldo em Bitcoins:'
      value={balance}
      mask='bitcoin'
      loading={loading}
      handleRefresh={updateData}
      reload={props.reload}
    />
  );
});

export default BalanceBtc;
