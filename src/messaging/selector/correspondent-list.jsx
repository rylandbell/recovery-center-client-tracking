var React = require('react');
var CorrespondentRow = require('./correspondent-row.jsx');

module.exports = ({listOfCorrespondences, activeId, selectCorrespondence}) => (
  <ul className="nav nav-pills nav-stacked">
    {listOfCorrespondences.map((correspondence,index) => <CorrespondentRow correspondence={correspondence} activeId={activeId} key={index} selectCorrespondence={selectCorrespondence}/>)}
  </ul>
);