// React component hierarchy: (*: Container Component)
// *ActiveConversationContainer
//   ActiveConversation
//     ConversationHeading
//     MessageLog
//       [MessageRow]
//         MessageContentBox
//     NewMessageInput
//       EnterToSend
// *ConversationSelectorContainer
//   ConversationSelector
//     CorrespondentList
//       [CorrespondentRow]
//     NewCorrespondentButton
//     *NewCorrespondentContainer
//       NewCorrespondentModal
//         ClientTable
//           [ClientRow]
//         [AddCorrespondentButton]

import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

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
      <Provider store={reduxStore}>
        <MessagingApp

          //state:
          reduxState = {reduxStore.getState()}

          //callbacks:
          selectCorrespondence={
            (newCorrespondenceId) => {
              reduxStore.dispatch(ActionCreator.selectCorrespondence(newCorrespondenceId));
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
        />
      </Provider>,
      document.getElementById('messaging-root')
    );    
  }
});