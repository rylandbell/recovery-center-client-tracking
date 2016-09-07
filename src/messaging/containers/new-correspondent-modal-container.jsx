'use strict';

import { connect } from 'react-redux';

import NewCorrespondentModal from '../selector/new-correspondent-modal.jsx';
import ActionCreator from '../action-creators.jsx';

const mapStateToProps = (state) => ({
  clientList: state.clientList,
  selectedClientRow: state.selectedClientRow
});

const mapDispatchToProps = (dispatch) => ({
  selectClientRow:
    (id) => {
      dispatch(ActionCreator.selectClientRow(id));
    },
  addNewCorrespondence:
    () => {
      dispatch(ActionCreator.addNewCorrespondence());
    }
});

const api = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCorrespondentModal);

export default api;