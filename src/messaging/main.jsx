// Conversation
//   ConversationHeading*
//   MessageLog
//     [MessageRow]*
//       MessageContentBox*
//   NewMessageInput*
//     EnterToSend*

var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var Helper = require('./helper.jsx');

var Reducers = require('./reducers.jsx');
var Conversation = require('./conversation.jsx');


var reduxStore = Redux.createStore(Reducers.parentReducer);
reduxStore.subscribe(render);
render();

function render() {
  ReactDOM.render(
    <Conversation
      reduxState = {reduxStore.getState()}
      handleTextChange = {
        (e) => {
          e.preventDefault();
          if(e.charCode===13 && reduxStore.getState().enterToSendStatus){
            $('.new-message-form input[type="submit"]').click();
          }
          reduxStore.dispatch({
            type: 'TEXT_ENTRY',
            enteredText: e.target.value
          });
        }
      }
      handleCheckboxChange = {
        (e) => {
          reduxStore.dispatch({
            type: 'CHECKBOX_UPDATE',
            checkboxValue: e.target.checked
          });
        }
      }
      handleSubmit = {
        (e) => {
          e.preventDefault();
          if(reduxStore.getState().enteredText === ''){
            return;
          } else {
            reduxStore.dispatch({
              type: 'SEND_MESSAGE',
              newMessage: Helper.addMessageProps(reduxStore.getState().enteredText)
            });
          }
        }
      }
      //On each keypress, check for the case that Enter was pressed and enterToSendStatus is true:
      listenForEnter = {
        (e) => {
          if(e.charCode===13 && reduxStore.getState().enterToSendStatus){
            e.preventDefault();
            $('.new-message-form input[type="submit"]').click();
          }
        }
      }
    /> ,
    document.getElementById('active-conversation')
  );  
}