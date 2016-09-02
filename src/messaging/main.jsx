// React component hierarchy:
// ActiveConversation
//   ConversationHeading
//   MessageLog
//     [MessageRow]
//       MessageContentBox
//   NewMessageInput
//     EnterToSend
//
// ConversationSelector
//   CorrespondentList
//     [CorrespondentRow]
//   NewCorrespondentButton
//   NewCorrespondentModal
//     [ClientTable]
//     [AddCorrespondentButton]


$(document).ready(function(){
  if(window.location.pathname==='/messaging'){
    var React = require('react');
    var ReactDOM = require('react-dom');
    var Redux = require('redux');
    require('babel-polyfill');

    var Helper = require('./helper.jsx');
    var Reducers = require('./reducers.jsx');
    var ActiveConversation = require('./active/active-conversation.jsx');
    var ConversationSelector = require('./selector/conversation-selector.jsx');

    var reduxStore = Redux.createStore(Reducers.messagingApp);
    reduxStore.subscribe(render);
    render();
  }
  function render() {
    //Render the list of available conversations:
    ReactDOM.render(
      <ConversationSelector 
        listOfCorrespondences={reduxStore.getState().listOfCorrespondences}
        activeId={reduxStore.getState().activeCorrespondence.correspondenceId}
        selectCorrespondence={
          (newCorrespondenceId) => {
            reduxStore.dispatch({
              type: 'SELECT_CORRESPONDENCE',
              id: newCorrespondenceId
            });
          }
        }
      />,
      document.getElementById('conversation-selector-root')
    );

    // Render the active conversation:
    ReactDOM.render(
      <ActiveConversation
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
      document.getElementById('active-conversation-root')
    );  
    
  }
});