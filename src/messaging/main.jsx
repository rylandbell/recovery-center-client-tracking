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
//     ClientTable
//       [ClientRow]
//     [AddCorrespondentButton]

import thunk from 'redux-thunk';

$(document).ready(function(){
  if(window.location.pathname==='/messaging'){
    var React = require('react');
    var ReactDOM = require('react-dom');
    var Redux = require('redux');
    
    require('babel-polyfill');

    var Helper = require('./helper.jsx');
    var ActionCreator = require('./action-creators.jsx')
    var Reducers = require('./reducers.jsx');
    var MessagingApp = require('./root-component.jsx');

    var reduxStore = Redux.createStore(Reducers.messagingApp, Redux.applyMiddleware(thunk));
    reduxStore.subscribe(render);
    render();
  }

  function render() {
    ReactDOM.render(
      <MessagingApp

        //state:
        reduxState = {reduxStore.getState()}

        //callbacks:
        selectCorrespondence={
          (newCorrespondenceId) => {
            reduxStore.dispatch(ActionCreator.selectCorrespondence(newCorrespondenceId));
          }
        }
        selectClientRow = {
          (id) => {
            reduxStore.dispatch(ActionCreator.selectClientRow(id));
          }
        }
        requestClientList={
          () => {
            Helper.myFetch(
              'http://dreamriverdigital.com/wasatch/client/get',
              'GET',
              (response => {
                reduxStore.dispatch(ActionCreator.receiveClientList(response));
              }),
              (response => {
                console.log(response)
              })        
            );
            reduxStore.dispatch(ActionCreator.requestClientListWaiting());
          }
        }
        handleTextChange = {
          (e) => {
            e.preventDefault();
            reduxStore.dispatch(ActionCreator.textEntry(e.target.value));
          }
        }
        handleCheckboxChange = {
          (e) => {
            reduxStore.dispatch(ActionCreator.checkboxUpdate(e.target.checked));
          }
        }
        handleSubmit = {
          (e) => {
            e.preventDefault();
            if(reduxStore.getState().enteredText === ''){
              return;
            } else {
              reduxStore.dispatch(ActionCreator.sendMessage(Helper.addMessageProps(reduxStore.getState().enteredText)));
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
      />,
      document.getElementById('messaging-root')
    );    
  }
});