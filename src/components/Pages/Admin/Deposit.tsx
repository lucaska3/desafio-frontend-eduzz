import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from 'components/Layout/Toolbar';
import BalanceBrl from 'components/Shared/CurrencyCard/BalanceBrl';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import React, { Fragment, memo } from 'react';
import { tap } from 'rxjs/operators';
import accountService from 'services/account';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  amount: yup.number().required()
});

const Deposit = memo(() => {
  const formik = useFormikObservable({
    initialValues: { amount: '0' },
    validationSchema,
    onSubmit(model, { setSubmitting }) {
      let value = parseFloat(model.amount);
      return accountService.deposit(value).pipe(
        tap(() => {
          setSubmitting(false);
          Toast.show('Depósito efetuada com sucesso!');
        }),
        logError(true)
      );
    }
  });

  return (
    <Fragment>
      <Toolbar title='Depósito' />
      <Card>
        <CardHeader title='Realizar Depósito em Conta' />
        <Grid container direction='row' wrap='wrap' alignItems='flex-start'>
          <Grid container item md={6}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <CardContent>
                <TextField name='amount' label='Valor' type='text' formik={formik} mask='money' />
              </CardContent>
              <CardActions>
                <Button disabled={formik.isSubmitting} color='primary' type='submit'>
                  DEPOSITAR
                </Button>
                {formik.isSubmitting && <LinearProgress color='primary' />}
              </CardActions>
            </form>
          </Grid>
          <Grid container item md={6} justify='flex-end' alignItems='center'>
            <Box mb={5} mr={5}>
              <BalanceBrl reload={formik.isSubmitting}></BalanceBrl>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Fragment>
  );
});
export default Deposit;
