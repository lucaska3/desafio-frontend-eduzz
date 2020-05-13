import { bindComponent } from 'helpers/rxjs-operators/bindComponent';
import { logError } from 'helpers/rxjs-operators/logError';
import React, { Fragment } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { tap } from 'rxjs/operators';
import authService from 'services/auth';

import PermissionHide from './PermissionHide';

interface IProps extends RouteProps {}

export default class PermissionRoute extends Route<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = { ...(this.state || {}) };
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();

    authService
      .isAuthenticated()
      .pipe(
        logError(),
        bindComponent(this),
        tap(isAuthenticated => {
          if (isAuthenticated) return;
          authService.openLogin();
        })
      )
      .subscribe(isAuthenticated => {
        this.setState({ isAuthenticated });
      });
  }

  render() {
    const { isAuthenticated } = this.state;

    if (!isAuthenticated) {
      return null;
    }

    return (
      <Fragment>
        <PermissionHide>{super.render()}</PermissionHide>

        <PermissionHide inverse>
          <p>Não encontrado</p>
        </PermissionHide>
      </Fragment>
    );
  }
}
