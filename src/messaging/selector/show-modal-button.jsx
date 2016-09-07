'use strict';

import React from 'react';

const api = ({handleClick}) => (
  <button data-toggle="modal" data-target="#new-conversation-modal" className="btn btn-success center-block" onClick={handleClick}>
    <span className="glyphicon glyphicon-plus"></span>
    &nbsp; Add Correspondent
  </button>
);

export default api;