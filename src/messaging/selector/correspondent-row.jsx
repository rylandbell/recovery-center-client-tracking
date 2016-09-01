var React = require('react');

module.exports = ({correspondence, activeId, selectCorrespondence}) => {
  function handleClick() {
    selectCorrespondence(correspondence.id);
  }
  return (
    <li role="presentation" className={activeId===correspondence.id ? 'active': ''} onClick={handleClick}>
      <a href="#">
        {correspondence.client.lastName}, {correspondence.client.firstName} &nbsp;&nbsp;
        {correspondence.clinician.flagged ? <span className="glyphicon glyphicon-envelope"></span> : null }
        <div className="small pull-right">{correspondence.client.currentLevelOfCare}</div>
      </a>
    </li>
  );
}