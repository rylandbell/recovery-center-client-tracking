'use strict';

import React from 'react';

import AddCorrespondentButton from './add-correspondent-button.jsx';
import ClientTable from './client-table.jsx';

const api = ({clientList, selectedClientRow, selectClientRow, addNewCorrespondence}) => (
  <div tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" id="new-conversation-modal" className="modal fade">
    <div role="document" className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button className='close' type='button' data-dismiss='modal' aria-label='Close'>
            <span aria-hidden='true'> × </span>
          </button>
          <div className="modal-title"> 
            <h4>Add New Correspondent</h4>
          </div>
        </div>
        <div className="modal-body">
          <ClientTable clientList={clientList} selectedClientRow={selectedClientRow} selectClientRow={selectClientRow}/>
        </div>
        <div className="modal-footer">
          <AddCorrespondentButton addNewCorrespondence={addNewCorrespondence}/>
        </div>
      </div>
    </div>
  </div>
);

export default api;