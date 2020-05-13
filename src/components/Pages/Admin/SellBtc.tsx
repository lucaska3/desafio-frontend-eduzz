import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import CurrencyCard, { BalanceBrl, BalanceBtc, BtcPrice } from 'components/Shared/CurrencyCard';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { tap } from 'rxjs/operators';
import * as yup from 'yup';

import cryptoService from '../../../services/crypto';

const validationSchema = yup.object().shape({
  amount: yup.number().required()
});

const SellBtc = memo(() => {
  const [sellValue, setSellValue] = useState(0);

  const formik = useFormikObservable({
    initialValues: { amount: '0' },
    validationSchema,
    onSubmit(model, { setSubmitting }) {
      return cryptoService.sell(sellValue).pipe(
        tap(() => {
          setSubmitting(false);
          Toast.show('Venda efetuada com sucesso!');
        }),
        logError(true)
      );
    }
  });

  useEffect(() => {
    const priceSubscriber = cryptoService.getSellPrice.subscribe(data => {
      setSellValue(parseFloat(formik.values.amount) * data);
    });
    return () => {
      priceSubscriber.unsubscribe();
    };
  }, [formik.values.amount]);

  return (
    <Fragment>
      <Toolbar title='Vender Bitcoins' />

      <Card>
        <CardLoader show={formik.isSubmitting} />

        <CardHeader title='Vender Bitcoins' />
        <Grid container wrap='wrap'>
          <Grid container item sm={6}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <CardContent>
                <TextField name='amount' label='Valor' type='text' formik={formik} mask='bitcoin' />
              </CardContent>
              <CardActions>
                <Button disabled={formik.isSubmitting} color='primary' type='submit'>
                  VENDER
                </Button>
                {formik.isSubmitting && <LinearProgress color='primary' />}
              </CardActions>
            </form>
            <Box mb={5} ml={5}>
              <CurrencyCard
                title={'A venda de ' + formik.values.amount + ' Bitcoins renderá:'}
                value={sellValue}
                mask='money'
                loading={false}
                reload={sellValue}
              />
            </Box>
          </Grid>
          <Grid container item sm={6} justify='flex-end' alignItems='flex-end' direction='column'>
            <Box mb={5} mr={5}>
              <BalanceBrl reload={formik.isSubmitting}></BalanceBrl>
            </Box>
            <Box mb={5} mr={5}>
              <BalanceBtc reload={formik.isSubmitting}></BalanceBtc>
            </Box>
            <Box mb={5} mr={5}>
              <BtcPrice isSell reload={formik.isSubmitting}></BtcPrice>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Fragment>
  );
});
export default SellBtc;
