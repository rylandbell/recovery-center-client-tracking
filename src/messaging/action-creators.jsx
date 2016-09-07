'use strict';

const api = {
  selectCorrespondence: (id) => (
    {
      type: 'SELECT_CORRESPONDENCE',
      id: id
    }    
  ),

  textEntry: (text) => (
    {
      type: 'TEXT_ENTRY',
      enteredText: text
    }    
  ),

  checkboxUpdate: (newValue) => (
    {
      type: 'CHECKBOX_UPDATE',
      checkboxValue: newValue
    }
  ),

  sendMessage: (newMessageObject) => (
    {
      type: 'SEND_MESSAGE',
      newMessage: newMessageObject
    }
  ),

  //~~~~~~Actions surround AJAX requests for client list:~~~~~~

  requestClientList: () => (
    {
      type: 'GET_CLIENT_LIST'
    }    
  ),

  receiveClientList: (response) => (
    { 
      type: 'RECEIVE_CLIENT_LIST',
      list: response
    }
  ),

  requestClientListWaiting: () => (
    {
      type: 'REQUEST_CLIENT_LIST_WAITING'
    }
  ),

  requestClientListFailure: () => (
    {
      type: 'REQUEST_CLIENT_LIST_FAILURE'
    }
  ),

  // ~~~~~~~~~~~~~~~~~~~~~~

  selectClientRow: (id) => (
    {
      type: 'SELECT_CLIENT_ROW',
      id: id
    }
  ),

  addNewCorrespondence: () => (
    {
      type: 'ADD_NEW_CORRESPONDENCE'
    }
  )
}

export default api;