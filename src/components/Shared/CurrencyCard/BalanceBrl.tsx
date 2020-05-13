import React, { memo, useCallback, useState } from 'react';
import { take } from 'rxjs/operators';
import accountService from 'services/account';

import CurrencyCard from './';

interface IProps {
  reload?: boolean;
}

const BalanceBrl = memo((props: IProps) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateData = useCallback(() => {
    setLoading(true);
    const balanceSubscription = accountService
      .balance()
      .pipe(take(1))
      .subscribe(data => {
        setBalance(data);
        setLoading(false);
      });
    return () => balanceSubscription.unsubscribe();
  }, []);

  return (
    <CurrencyCard
      title='Saldo em Reais;'
      value={balance}
      mask='money'
      loading={loading}
      handleRefresh={updateData}
      reload={props.reload}
    />
  );
});

export default BalanceBrl;
