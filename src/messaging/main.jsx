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

//babel-polyfill will polyfill ES6 features, specifically Promises for fetch
import 'babel-polyfill';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Redux from 'redux';

import Reducers from './reducers.jsx';
import MessagingApp from './components/root-component.jsx';
        
const store = Redux.createStore(Reducers.messagingApp, Redux.applyMiddleware(thunk));
store.subscribe(render);
render();

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <MessagingApp reduxState={store.getState()}/>
    </Provider>,
    document.getElementById('messaging-root')
  );    
}
