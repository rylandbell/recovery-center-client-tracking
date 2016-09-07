import { connect } from 'react-redux';

const NewCorrespondentModal = require('../selector/new-correspondent-modal.jsx');
const ActionCreator = require('../action-creators.jsx');

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

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCorrespondentModal);