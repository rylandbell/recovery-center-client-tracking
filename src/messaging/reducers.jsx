module.exports.parentReducer = (state = {conversation: {messages: [], correspondent: {firstName: '',lastName: ''}}, msgContent: '', enterToSendStatus: false}, action) => {
  switch (action.type){
    // case 'UPDATE_DATA':
    //   return Object.assign({}, state, { data: action.data });
    default:
      return state;
  }
};
