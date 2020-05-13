import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Toolbar from 'components/Layout/Toolbar';
import { BalanceBrl, BalanceBtc, BtcPrice } from 'components/Shared/CurrencyCard';
import React, { Fragment, memo } from 'react';

import BtcHistory from './BtcHistory';
import BtcVolume from './BtcVolume';

const useStyles = makeStyles({
  marginBottom: {
    marginBottom: 15
  }
});

const DashboardIndexPage = memo((props: {}) => {
  const classes = useStyles(props);

  return (
    <Fragment>
      <Toolbar title='Dashboard' />
      <Grid container wrap='wrap'>
        <Grid container md={8} item>
          <Grid container wrap='wrap' className={classes.marginBottom}>
            <Box mb={2} mr={5}>
              <BalanceBrl />
            </Box>
            <Box mb={2} mr={5}>
              <BalanceBtc />
            </Box>
          </Grid>
          <Grid container wrap='wrap' className={classes.marginBottom}>
            <Box mb={2} mr={5}>
              <BtcPrice reload isBuy />
            </Box>
            <Box mb={2} mr={5}>
              <BtcPrice reload isSell />
            </Box>
          </Grid>
        </Grid>
        <Grid container md={4} className={classes.marginBottom} item>
          <BtcVolume />
        </Grid>
      </Grid>
      <BtcHistory />
    </Fragment>
  );
});

export default DashboardIndexPage;
