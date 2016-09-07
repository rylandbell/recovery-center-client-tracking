var React = require('react');

var ConversationSelector = require('./selector/conversation-selector.jsx');
var ActiveConversationContainer = require('./containers/active-conversation-container.jsx');

module.exports = ({reduxState, selectCorrespondence, requestClientList}) => (
  <div className='row'>
    <div className='col-xs-12 col-sm-5 col-lg-3'>
      <ConversationSelector
        reduxState={reduxState} 
        listOfCorrespondences={reduxState.listOfCorrespondences}
        activeId={reduxState.activeCorrespondence.correspondenceId}
        selectCorrespondence={selectCorrespondence}
        requestClientList={requestClientList}
      />
    </div>
    <div className='col-xs-12 col-sm-7 col-lg-8 col-lg-offset-1'>
      <ActiveConversationContainer reduxState={reduxState}/>
    </div>
  </div>
);