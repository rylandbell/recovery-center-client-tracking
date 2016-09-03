var React = require('react');

var ConversationSelector = require('./selector/conversation-selector.jsx');

var ActiveConversation = require('./active/active-conversation.jsx');

module.exports = ({reduxState, selectCorrespondence, requestClientList, handleTextChange, handleCheckboxChange, handleSubmit, listenForEnter}) => (
  <div className='row'>
    <div className='col-xs-12 col-sm-5 col-lg-3'>
      <ConversationSelector 
        listOfCorrespondences={reduxState.listOfCorrespondences}
        clientList={reduxState.clientList}
        activeId={reduxState.activeCorrespondence.correspondenceId}
        selectCorrespondence={selectCorrespondence}
        requestClientList={requestClientList}
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