import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/Refresh';
import CardLoader from 'components/Shared/CardLoader';
import useMask, { Masks } from 'hooks/useMask';
import React, { memo, useEffect } from 'react';

interface IProps {
  loading: boolean;
  title: string;
  value: number;
  mask: Masks;
  reload: any;
  refresh?: boolean;
  handleRefresh?: () => void;
}

const CurrencyCard = memo((props: IProps) => {
  const { maskedValue } = useMask(props.mask, props.value);
  const { reload, handleRefresh } = props;

  useEffect(() => {
    handleRefresh && handleRefresh();
  }, [reload, handleRefresh]);

  return (
    <Card>
      <CardLoader show={props.loading} />

      <CardContent>
        <Typography gutterBottom color='textSecondary' variant='subtitle1'>
          {props.title}
        </Typography>
        <Grid container direction='row' justify='space-between' alignItems='center'>
          <Typography color='textPrimary' variant='h5'>
            {maskedValue}
          </Typography>
          {props.refresh && (
            <IconButton color='primary' aria-label='refresh' onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
});

export { default as BalanceBrl } from './BalanceBrl';
export { default as BalanceBtc } from './BalanceBtc';
export { default as BtcPrice } from './BtcPrice';
export default CurrencyCard;
