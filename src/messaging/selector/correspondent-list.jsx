'use strict';

import React from 'react';

import CorrespondentRow from './correspondent-row.jsx';

const api = ({listOfCorrespondences, activeId, selectCorrespondence}) => (
  <ul className="nav nav-pills nav-stacked">
    {listOfCorrespondences.map((correspondence,index) => <CorrespondentRow correspondence={correspondence} activeId={activeId} key={index} selectCorrespondence={selectCorrespondence}/>)}
  </ul>
);

export default api;