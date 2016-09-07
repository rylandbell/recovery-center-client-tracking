var React = require('react');

var ShowModalButton = require('./show-modal-button.jsx');
var NewCorrespondentContainer = require('../containers/new-correspondent-container.jsx');
var CorrespondentList = require('./correspondent-list.jsx');

module.exports = ({reduxState, listOfCorrespondences, activeId, selectCorrespondence, requestClientList}) => {
  return(
    <div>
      <div className="conversation-list">
        <h4 className="text-center">My Correspondents</h4>
        <hr/>
        <CorrespondentList listOfCorrespondences={listOfCorrespondences} activeId={activeId} selectCorrespondence={selectCorrespondence}/>
        <hr/>
        <ShowModalButton handleClick={requestClientList}/>
      </div>
      <NewCorrespondentContainer />
    </div>
  );
}

