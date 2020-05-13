import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from 'components/Layout/Toolbar';
import CurrencyCard, { BalanceBrl, BalanceBtc, BtcPrice } from 'components/Shared/CurrencyCard';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import useMask from 'hooks/useMask';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { tap } from 'rxjs/operators';
import * as yup from 'yup';

import cryptoService from '../../../services/crypto';

const validationSchema = yup.object().shape({
  amount: yup.number().required()
});

const BuyBtc = memo(() => {
  const [buyValue, setBuyValue] = useState(0);
  const formik = useFormikObservable({
    initialValues: { amount: '0' },
    validationSchema,
    onSubmit(model, { setSubmitting }) {
      return cryptoService.buy(parseFloat(model.amount)).pipe(
        tap(() => {
          setSubmitting(false);
          Toast.show('Venda efetuada com sucesso!');
        }),
        logError(true)
      );
    }
  });
  const { maskedValue } = useMask('money', formik.values.amount);

  useEffect(() => {
    const priceSubscriber = cryptoService.getBuyPrice.subscribe(data => {
      setBuyValue(parseFloat(formik.values.amount) / data);
    });

    return () => {
      priceSubscriber.unsubscribe();
    };
  }, [formik.values.amount]);

  return (
    <Fragment>
      <Toolbar title='Comprar Bitcoin' />

      <Card>
        <CardHeader title='Comprar Bitcoins' />
        <Grid container>
          <Grid container item sm={6} alignItems='flex-start' wrap='wrap'>
            <Box mb={5} ml={5}>
              <form noValidate onSubmit={formik.handleSubmit}>
                <CardContent>
                  <TextField name='amount' label='Valor' type='text' formik={formik} mask='money' />
                </CardContent>
                <CardActions>
                  <Button disabled={formik.isSubmitting} color='primary' type='submit'>
                    COMPRAR
                  </Button>
                  {formik.isSubmitting && <LinearProgress color='primary' />}
                </CardActions>
              </form>
            </Box>
            <Box mb={5} ml={5}>
              <CurrencyCard
                title={'A compra de ' + maskedValue + ' equivale á aproximadamente:'}
                value={buyValue}
                mask='bitcoin'
                loading={false}
                reload={buyValue}
              />
            </Box>
          </Grid>
          <Grid container item sm={6} justify='flex-end' alignItems='flex-end' direction='column' wrap='wrap'>
            <Box mb={5} mr={5}>
              <BalanceBrl reload={formik.isSubmitting}></BalanceBrl>
            </Box>
            <Box mb={5} mr={5}>
              <BalanceBtc reload={formik.isSubmitting}></BalanceBtc>
            </Box>
            <Box mb={5} mr={5}>
              <BtcPrice isBuy reload={formik.isSubmitting}></BtcPrice>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Fragment>
  );
});
export default BuyBtc;
