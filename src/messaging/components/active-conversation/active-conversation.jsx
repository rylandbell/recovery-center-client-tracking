'use strict';

import React from 'react';

import ConversationHeading from './conversation-heading.jsx';
import MessageLog from './message-log.jsx';
import NewMessageInput from './new-message-input.jsx';

//owns message array state, assembles subcomponents: 
const api = ({activeCorrespondence, enteredText, enterToSendStatus, handleSubmit, handleTextChange, handleCheckboxChange, listenForEnter}) => (
  <div className="panel panel-primary">
    <div className="panel-heading">
      <ConversationHeading correspondent={activeCorrespondence.correspondent} />  
    </div>
    <div className="panel-body conversation-panel">
      <MessageLog activeCorrespondence={activeCorrespondence}/>
      <div className="clearfix"></div>
    </div>

    <div className="panel-footer"> 
      <NewMessageInput 
        enteredText={enteredText} 
        enterToSendStatus={enterToSendStatus} 
        handleSubmit={handleSubmit} 
        handleTextChange = {handleTextChange}
        handleCheckboxChange = {handleCheckboxChange}
        listenForEnter = {listenForEnter}
      />
    </div>
  </div>
);
  
export default api;