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

'use strict';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Redux from 'redux';
import 'babel-polyfill';

import Reducers from './reducers.jsx';
import MessagingApp from './root-component.jsx';

  if(window.location.pathname==='/messaging'){
        
    var reduxStore = Redux.createStore(Reducers.messagingApp, Redux.applyMiddleware(thunk));
    reduxStore.subscribe(render);
    render();
  }

  function render() {
    ReactDOM.render(
      <Provider store={reduxStore}>
        <MessagingApp
          reduxState = {reduxStore.getState()}
        />
      </Provider>,
      document.getElementById('messaging-root')
    );    
  }
