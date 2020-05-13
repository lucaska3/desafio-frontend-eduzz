import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import React, { memo, MouseEvent } from 'react';
import { tap } from 'rxjs/operators';
import authService from 'services/auth';
import * as yup from 'yup';

interface IProps {
  onCancel: (e: MouseEvent<HTMLElement>) => void;
  onComplete: () => void;
}

const validationSchema = yup.object().shape({
  email: yup.string().required().email(),
  name: yup.string().required(),
  password: yup.string().required()
});

const useStyle = makeStyles({
  buttons: {
    justifyContent: 'space-between'
  }
});

const LoginDialogSignUp = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable({
    initialValues: { email: '', password: '', name: '' },
    validationSchema,
    onSubmit(model) {
      return authService.createAccount(model.name, model.email, model.password).pipe(
        tap(() => {
          Toast.show('Cadastro concluído com sucesso');
          props.onComplete();
          formik.resetForm();
        }),
        logError(true)
      );
    }
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent>
          <Typography gutterBottom>Insira as informações de cadastro:</Typography>

          <TextField name='name' label='Nome' type='name' formik={formik} />
          <TextField name='email' label='Email' type='email' formik={formik} />
          <TextField name='password' label='Senha' type='password' formik={formik} margin='none' />
        </CardContent>

        <CardActions className={classes.buttons}>
          <Button disabled={formik.isSubmitting} size='small' onClick={props.onCancel}>
            Voltar
          </Button>
          <Button disabled={formik.isSubmitting} color='primary' type='submit'>
            Cadastrar
          </Button>
        </CardActions>

        {formik.isSubmitting && <LinearProgress color='primary' />}
      </Card>
    </form>
  );
});

export default LoginDialogSignUp;
