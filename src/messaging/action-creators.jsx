module.exports.selectCorrespondence = (id) => (
  {
    type: 'SELECT_CORRESPONDENCE',
    id: id
  }    
)

module.exports.textEntry = (text) => (
  {
    type: 'TEXT_ENTRY',
    enteredText: text
  }    
)

module.exports.checkboxUpdate = (newValue) => (
  {
    type: 'CHECKBOX_UPDATE',
    checkboxValue: newValue
  }
)

module.exports.sendMessage = (newMessageObject) => (
  {
    type: 'SEND_MESSAGE',
    newMessage: newMessageObject
  }
)

//~~~~~~Actions surround AJAX requests for client list:~~~~~~

module.exports.requestClientList = () => (
  {
    type: 'GET_CLIENT_LIST'
  }    
)

module.exports.receiveClientList = (response) => (
  { 
    type: 'RECEIVE_CLIENT_LIST',
    list: response
  }
)

module.exports.requestClientListWaiting = () => (
  {
    type: 'REQUEST_CLIENT_LIST_WAITING'
  }
)

module.exports.requestClientListFailure = () => (
  {
    type: 'REQUEST_CLIENT_LIST_FAILURE'
  }
)

// ~~~~~~~~~~~~~~~~~~~~~~

module.exports.selectClientRow = (id) => (
  {
    type: 'SELECT_CLIENT_ROW',
    id: id
  }
)

module.exports.addNewCorrespondence = () => (
  {
    type: 'ADD_NEW_CORRESPONDENCE'
  }
)