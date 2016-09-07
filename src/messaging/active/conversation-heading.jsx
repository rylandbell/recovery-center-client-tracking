'use strict';

import React from 'react';

//simply displays name of correspondent
const api = ({correspondent}) => (  
  <div className="panel-title">{correspondent.firstName + ' '+ correspondent.lastName}</div>
);

export default api;