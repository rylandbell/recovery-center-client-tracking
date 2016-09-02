var Redux = require('redux');
var ReduxThunk = require('redux-thunk').default;

var fudge = require('./fudge.js');
var Helper = require('./helper.jsx');

const lookup = (arr) => {
  const lookupObject = {};
  arr.forEach((obj, index) => {
    lookupObject[arr[index].id] = obj;
  });
  // console.log(lookupObject);
  return lookupObject;
}

//list of all clients, which can be used to add a new correspondent
const clientList = (state=[], action) => {
  switch(action.type) {
    case 'GET_CLIENT_LIST':
      // Helper.myFetch(
      //   'http://dreamriverdigital.com/wasatch/client/get',
      //   'GET',
      //   (response => {console.log(response)}),
      //   (response => {console.log(response)})        
      // );
      return state;
    case 'GET_CLIENTS_WAITING':
      console.log('waiting....');
      return state;
    case 'GET_CLIENTS_SUCCESS':
      console.log('success!!');
      return state;
    case 'GET_CLIENTS_FAILURE':
      console.log('failure!');
      return state;
    default:
      return state;
  }
}

const listOfCorrespondences = (state=fudge, action) => {
  switch(action.type){
    default:
      return state;
  }
}

const messages = (state=fudge[0].messages, action) => {
  switch(action.type){
    case 'SELECT_CORRESPONDENCE':
      return lookup(fudge)[action.id].messages;
    case 'SEND_MESSAGE':
      return state.concat([action.newMessage]);
    default:
      return state;
  }
}

const correspondent = (state=fudge[0].client, action) => {
  switch(action.type){
    case 'SELECT_CORRESPONDENCE':
      return lookup(fudge)[action.id].client;
    default:
      return state;
  }
}

const correspondenceId = (state=fudge[0].id, action) => {
  switch(action.type){
    case 'SELECT_CORRESPONDENCE':
      return action.id;
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

const activeCorrespondence = Redux.combineReducers({
  correspondenceId: correspondenceId,
  correspondent: correspondent,
  messages: messages
});

module.exports.messagingApp = Redux.combineReducers({
  listOfCorrespondences: listOfCorrespondences,
  clientList: clientList,
  activeCorrespondence: activeCorrespondence,
  enterToSendStatus: enterToSendStatus,
  enteredText: enteredText
});