import React, { Fragment, memo } from 'react';

import LoginDialog from './Login';

const Dialogs = memo(() => {
  return (
    <Fragment>
      <LoginDialog />
    </Fragment>
  );
});

export default Dialogs;
