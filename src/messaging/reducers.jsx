var fudge = require('./fudge.js');
var Redux = require('redux');

var messages = (state=fudge.messages, action) => {
  switch(action.type){
    case 'SEND_MESSAGE':
      return state.concat([action.newMessage]);
    default:
      return state;
  }
}

var correspondent = (state={firstName: fudge.correspondent.firstName, lastName: fudge.correspondent.lastName}, action) => {
  switch(action.type){
    default:
      return state;
  }
}

var enterToSendStatus = (state=true, action) => {
  switch(action.type){
    case 'CHECKBOX_UPDATE':
      return action.checkboxValue;
    default:
      return state;
  }
}

var enteredText = (state='', action) => {
  switch(action.type){
    case 'TEXT_ENTRY':
      return action.enteredText;
    case 'SEND_MESSAGE':
      return '';
    default:
      return state;
  }
}

var conversation = Redux.combineReducers({
  correspondent: correspondent,
  messages: messages
});

module.exports.messagingApp = Redux.combineReducers({
  conversation: conversation,
  enterToSendStatus: enterToSendStatus,
  enteredText: enteredText
});