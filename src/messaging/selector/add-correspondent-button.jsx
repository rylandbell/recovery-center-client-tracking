var React = require('react');

module.exports = ({addNewCorrespondence}) => (
  <button className="btn btn-primary" onClick={addNewCorrespondence} data-dismiss="modal"> Add Selected Client</button>
);
