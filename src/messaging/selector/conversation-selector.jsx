'use strict';

import React from 'react';

import ShowModalButton from './show-modal-button.jsx';
import NewCorrespondentModalContainer from '../containers/new-correspondent-modal-container.jsx';
import CorrespondentList from './correspondent-list.jsx';

const api = ({listOfCorrespondences, activeId, selectCorrespondence, requestClientList}) => {
  return(
    <div>
      <div className="conversation-list">
        <h4 className="text-center">My Correspondents</h4>
        <hr/>
        <CorrespondentList listOfCorrespondences={listOfCorrespondences} activeId={activeId} selectCorrespondence={selectCorrespondence}/>
        <hr/>
        <ShowModalButton handleClick={requestClientList}/>
      </div>
      <NewCorrespondentModalContainer />
    </div>
  );
}

export default api;