var React = require('react');

var ShowModalButton = require('./show-modal-button.jsx');
var NewCorrespondentModal = require('./new-correspondent-modal.jsx');
var CorrespondentList = require('./correspondent-list.jsx');

module.exports = ({listOfCorrespondences, clientList, activeId, selectedClientRow, selectCorrespondence, selectClientRow, requestClientList}) => {
  return(
    <div>
      <div className="conversation-list">
        <h4 className="text-center">My Correspondents</h4>
        <hr/>
        <CorrespondentList listOfCorrespondences={listOfCorrespondences} activeId={activeId} selectCorrespondence={selectCorrespondence}/>
        <hr/>
        <ShowModalButton handleClick={requestClientList}/>
      </div>
      <NewCorrespondentModal clientList={clientList} selectedClientRow={selectedClientRow} selectClientRow={selectClientRow}/>
    </div>
  );
}

