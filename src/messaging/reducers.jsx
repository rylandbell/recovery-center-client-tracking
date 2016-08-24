var fudge = require('./fudge.js');

module.exports.parentReducer = (state = {
  // conversation: {
  //   messages: [],
  //   correspondent: {
  //     firstName: '',
  //     lastName: ''
  //   }
  // }, 
  conversation: fudge,
  enteredText: '', 
  enterToSendStatus: true
}, action) => {
  switch (action.type){
    case 'TEXT_ENTRY':
      return Object.assign({}, state, { enteredText: action.enteredText });
    case 'CHECKBOX_UPDATE':
      return Object.assign({}, state, { enterToSendStatus: action.checkboxValue });
    case 'SEND_MESSAGE':
      var conversation = Object.assign({}, state.conversation);
      conversation.messages.push(action.newMessage);
      return Object.assign({}, state, {conversation: conversation, enteredText: ''});
    default:
      return state;
  }
};
