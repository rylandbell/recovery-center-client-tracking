'use strict';

var Redux = require('redux');

var fudge = require('./fudge.js');
var Helper = require('./helper.jsx');

//re-indexes an array by the id property of its member objects
const lookup = (arr) => {
  const lookupObject = {};
  arr.forEach((obj, index) => {
    lookupObject[arr[index].id] = obj;
  });
  return lookupObject;
}

//list of all clients, which can be used to add a new correspondent
const clientList = (
  state = {
    list: [],
    isFetching: false
  },
  action) => {
  switch(action.type) {
    case 'REQUEST_CLIENT_LIST_WAITING':
      return Object.assign({}, state, {isFetching: true});
    case 'REQUEST_CLIENT_LIST_FAILURE':
      console.log('failure!');
      return Object.assign({}, state, {isFetching: false});
    case 'RECEIVE_CLIENT_LIST':
      return {list: action.list.concat().sort(Helper.sortByLastName), isFetching: false};
    default:
      return state;
  }
}

const listOfCorrespondences = (state=fudge, action) => {
  switch(action.type){
    case 'ADD_NEW_CORRESPONDENCE':
      console.log(action);
      return state;
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

const selectedClientRow = (state='', action) => {
  switch(action.type){
    case 'SELECT_CLIENT_ROW':
      return action.id;
    default:
      return state;
  }
}

const activeCorrespondence = Redux.combineReducers({
  correspondenceId: correspondenceId,
  correspondent: correspondent,
  messages: messages
});

const api = {
  messagingApp: Redux.combineReducers({
    listOfCorrespondences: listOfCorrespondences,
    clientList: clientList,
    selectedClientRow: selectedClientRow,
    activeCorrespondence: activeCorrespondence,
    enterToSendStatus: enterToSendStatus,
    enteredText: enteredText
  })
}

export default api;