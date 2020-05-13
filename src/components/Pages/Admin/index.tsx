import makeStyles from '@material-ui/core/styles/makeStyles';
import Drawer from 'components/Layout/Drawer';
import BankTransferInIcon from 'mdi-react/BankTransferInIcon';
import CashPlusIcon from 'mdi-react/CashPlusIcon';
import CurrencyBtcIcon from 'mdi-react/CurrencyBtcIcon';
import ViewDashboardIcon from 'mdi-react/ViewDashboardIcon';
import React, { memo, useCallback, useRef, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import BuyBtc from './BuyBtc';
import DashboardIndexPage from './Dashboard/';
import Deposit from './Deposit';
import SellBtc from './SellBtc';

export const ScrollTopContext = React.createContext<Function>(() => {});

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100vw',
    height: '100vh'
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    padding: theme.variables.contentPadding,
    [theme.breakpoints.up('sm')]: {
      padding: theme.variables.contentPaddingUpSm
    }
  }
}));

const AdminPage = memo((props: {}) => {
  const classes = useStyles(props);

  const mainContent = useRef<HTMLDivElement>();
  const [menu] = useState([
    {
      path: '/',
      display: 'Dashboard',
      icon: ViewDashboardIcon
    },
    {
      path: '/deposito',
      display: 'Depósito',
      icon: BankTransferInIcon
    },
    {
      path: '/compra',
      display: 'Comprar BTC',
      icon: CurrencyBtcIcon
    },
    {
      path: '/venda',
      display: 'Vender BTC',
      icon: CashPlusIcon
    }
  ]);

  const scrollTop = useCallback(() => setTimeout(() => mainContent.current.scrollTo(0, 0), 100), []);
  const renderRedirect = useCallback(() => <Redirect to='/' />, []);

  return (
    <div className={classes.root}>
      <ScrollTopContext.Provider value={scrollTop}>
        <Drawer menu={menu}>
          <main ref={mainContent} className={classes.content}>
            <Switch>
              <Route path='/deposito' component={Deposit} />
              <Route path='/compra' component={BuyBtc} />
              <Route path='/venda' component={SellBtc} />
              <Route path='/' component={DashboardIndexPage} />
              <Route render={renderRedirect} />
            </Switch>
          </main>
        </Drawer>
      </ScrollTopContext.Provider>
    </div>
  );
});

export default AdminPage;
