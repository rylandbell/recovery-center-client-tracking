var React = require('react');

var ConversationSelector = require('./selector/conversation-selector.jsx');

var ActiveConversation = require('./active/active-conversation.jsx');

module.exports = ({reduxState, selectCorrespondence, selectClientRow, requestClientList, handleTextChange, handleCheckboxChange, handleSubmit, listenForEnter, addNewCorrespondence}) => (
  <div className='row'>
    <div className='col-xs-12 col-sm-5 col-lg-3'>
      <ConversationSelector 
        listOfCorrespondences={reduxState.listOfCorrespondences}
        clientList={reduxState.clientList}
        activeId={reduxState.activeCorrespondence.correspondenceId}
        selectedClientRow={reduxState.selectedClientRow}
        selectCorrespondence={selectCorrespondence}
        selectClientRow={selectClientRow}
        requestClientList={requestClientList}
        addNewCorrespondence={addNewCorrespondence}
      />
    </div>
    <div className='col-xs-12 col-sm-7 col-lg-8 col-lg-offset-1'>
      <ActiveConversation
        reduxState={reduxState}
        handleTextChange={handleTextChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmit={handleSubmit}
        listenForEnter={listenForEnter}
      />
    </div>
  </div>
);