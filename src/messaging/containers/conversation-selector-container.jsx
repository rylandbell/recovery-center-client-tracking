'use strict';

import { connect } from 'react-redux';

import ConversationSelector from '../selector/conversation-selector.jsx';
import ActionCreator from '../action-creators.jsx';
import Helper from '../helper.jsx';

const mapStateToProps = (state) => ({
  listOfCorrespondences: state.listOfCorrespondences,
  activeId: state.activeCorrespondence.correspondenceId
});

const mapDispatchToProps = (dispatch) => ({
  selectCorrespondence: 
    (newCorrespondenceId) => {
      dispatch(ActionCreator.selectCorrespondence(newCorrespondenceId));
    },
  requestClientList:
    () => {
      Helper.myFetch(
        'http://dreamriverdigital.com/wasatch/client/get',
        'GET',
        (response => {
          dispatch(ActionCreator.receiveClientList(response));
        }),
        (response => {
          console.log(response)
        })        
      );
      dispatch(ActionCreator.requestClientListWaiting());
    }
});

const api = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationSelector);

export default api;