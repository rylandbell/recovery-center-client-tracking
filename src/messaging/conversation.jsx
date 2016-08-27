var React = require('react');

var ConversationHeading = require('./conversation-heading.jsx');
var MessageLog = require('./message-log.jsx');
var NewMessageInput = require('./new-message-input.jsx');

//owns message array state, assembles subcomponents: 
module.exports = ({reduxState, handleSubmit, handleTextChange, handleCheckboxChange, listenForEnter}) => (
  <div className="panel panel-primary">
    <div className="panel-heading">
      <ConversationHeading correspondent={reduxState.conversation.correspondent} />
    </div>

    <div className="panel-body conversation-panel">
      <MessageLog messages={reduxState.conversation.messages}/>
      <div className="clearfix"></div>
    </div>

    <div className="panel-footer"> 
      <NewMessageInput 
        enteredText={reduxState.enteredText} 
        enterToSendStatus={reduxState.enterToSendStatus} 
        handleSubmit={handleSubmit} 
        handleTextChange = {handleTextChange}
        handleCheckboxChange = {handleCheckboxChange}
        listenForEnter = {listenForEnter}
      />
    </div>
  </div>
);
  
