'use strict';

import React from 'react';

const api = ({addNewCorrespondence}) => (
  <button className="btn btn-primary" onClick={addNewCorrespondence} data-dismiss="modal"> Add Selected Client</button>
);

export default api;