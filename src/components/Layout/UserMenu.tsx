import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ThemeContext from 'assets/theme/context';
import DropdownMenu from 'components/Shared/DropdownMenu';
import OptionItem from 'components/Shared/DropdownMenu/OptionItem';
import { logError } from 'helpers/rxjs-operators/logError';
import DarkIcon from 'mdi-react/Brightness4Icon';
import LightIcon from 'mdi-react/Brightness5Icon';
import ExitToAppIcon from 'mdi-react/ExitToAppIcon';
import React, { memo, useContext } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import authService from 'services/auth';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: -10,
    padding: 0
  },
  avatar: {
    width: 40,
    height: 40,
    fontSize: 16,
    backgroundColor: theme.palette.secondary.main
  }
}));

const UserMenu = memo((props: {}) => {
  const classes = useStyles(props);
  const themeContext = useContext(ThemeContext);
  const avatarLetters = 'A';

  const [handleLogout] = useCallbackObservable(() => {
    return of(true).pipe(
      switchMap(() => authService.logout()),
      logError()
    );
  }, []);

  return (
    <DropdownMenu anchorOrigin={{ vertical: 35, horizontal: 'right' }}>
      <IconButton color='inherit' className={classes.button}>
        <Avatar className={classes.avatar}>{avatarLetters}</Avatar>
      </IconButton>
      <OptionItem
        text={themeContext.currentTheme === 'light' ? 'Tema Escuro' : 'Tema Claro'}
        icon={themeContext.currentTheme === 'light' ? DarkIcon : LightIcon}
        handler={themeContext.toogleTheme}
      />
      <OptionItem text='Sair' icon={ExitToAppIcon} handler={handleLogout} />
    </DropdownMenu>
  );
});

export default UserMenu;
