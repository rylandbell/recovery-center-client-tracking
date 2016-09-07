import { connect } from 'react-redux';

const ActiveConversation = require('../active/active-conversation.jsx');
const ActionCreator = require('../action-creators.jsx');
const Helper = require('../helper.jsx');


const mapStateToProps = (state) => ({
  activeCorrespondence: state.activeCorrespondence,
  enterToSendStatus: state.enterToSendStatus,
  enteredText: state.enteredText
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleTextChange:
    (e) => {
      e.preventDefault();
      dispatch(ActionCreator.textEntry(e.target.value));
    },
  handleCheckboxChange:
    (e) => {
      dispatch(ActionCreator.checkboxUpdate(e.target.checked));
    },
  handleSubmit:
    (e) => {
      e.preventDefault();
      if(ownProps.reduxState.enteredText === ''){
        return;
      } else {
        dispatch(ActionCreator.sendMessage(Helper.addMessageProps(ownProps.reduxState.enteredText)));
      }
    },
  listenForEnter:
    (e) => {
      if(e.charCode===13 && ownProps.reduxState.enterToSendStatus){
        e.preventDefault();
        $('.new-message-form input[type="submit"]').click();
      }
    }
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveConversation);

