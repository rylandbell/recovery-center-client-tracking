module.exports.selectCorrespondence = (id) => (
  {
    type: 'SELECT_CORRESPONDENCE',
    id: id
  }    
)

module.exports.getClientList = () => (
  {
    type: 'GET_CLIENT_LIST'
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