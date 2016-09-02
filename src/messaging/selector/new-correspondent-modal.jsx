var React = require('react');

var AddCorrespondentButton = require('./add-correspondent-button.jsx');
var ClientTable = require('./client-table.jsx');

module.exports = () => (
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
          <ClientTable />
        </div>
        <div className="modal-footer">
          <AddCorrespondentButton />
        </div>
      </div>
    </div>
  </div>
);