import { logError } from 'helpers/rxjs-operators/logError';
import { memo, Props } from 'react';
import { useObservable } from 'react-use-observable';
import authService from 'services/auth';

interface IProps extends Props<{}> {
  passIfNull?: boolean;
  inverse?: boolean;
}

const PermissionHide = memo<IProps>(props => {
  const [canAccess] = useObservable(() => {
    return authService.isAuthenticated().pipe(logError());
  }, []);

  if (canAccess === undefined || canAccess === null) {
    return null;
  }

  if (props.inverse && !canAccess) {
    return props.children as any;
  }

  if (props.inverse || !canAccess) {
    return null;
  }

  return props.children as any;
});

export default PermissionHide;
