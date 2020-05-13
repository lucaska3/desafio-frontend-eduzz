import React, { memo, useCallback, useState } from 'react';
import { take } from 'rxjs/operators';
import cryptoService from 'services/crypto';

import CurrencyCard from './';

interface IProps {
  reload: boolean;
  isBuy?: boolean;
  isSell?: boolean;
}

const BtcPrice = memo((props: IProps) => {
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateData = useCallback(() => {
    setLoading(true);
    const btcPriceSubscription = cryptoService
      .price()
      .pipe(take(1))
      .subscribe(data => {
        setPrice(props.isBuy ? data.buy : data.sell);
        setLoading(false);
      });
    return () => btcPriceSubscription.unsubscribe();
  }, [props.isBuy]);

  return (
    <CurrencyCard
      title={props.isBuy ? 'Valor de Compra do Bitcoin' : 'Valor de Venda do Bitcoin'}
      value={price}
      mask='money'
      loading={loading}
      refresh
      handleRefresh={updateData}
      reload={props.reload}
    />
  );
});

export default BtcPrice;
