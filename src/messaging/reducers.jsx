var fudge = require('./fudge.js');
var Redux = require('redux');

const messages = (state=fudge.messages, action) => {
  switch(action.type){
    case 'SEND_MESSAGE':
      return state.concat([action.newMessage]);
    default:
      return state;
  }
}

const correspondent = (state={firstName: fudge.correspondent.firstName, lastName: fudge.correspondent.lastName}, action) => {
  switch(action.type){
    default:
      return state;
  }
}

const enterToSendStatus = (state=true, action) => {
  switch(action.type){
    case 'CHECKBOX_UPDATE':
      return action.checkboxValue;
    default:
      return state;
  }
}

const enteredText = (state='', action) => {
  switch(action.type){
    case 'TEXT_ENTRY':
      return action.enteredText;
    case 'SEND_MESSAGE':
      return '';
    default:
      return state;
  }
}

const conversation = Redux.combineReducers({
  correspondent: correspondent,
  messages: messages
});

module.exports.messagingApp = Redux.combineReducers({
  conversation: conversation,
  enterToSendStatus: enterToSendStatus,
  enteredText: enteredText
});