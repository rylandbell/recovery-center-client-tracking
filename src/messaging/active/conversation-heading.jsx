var React = require('react');

//simply displays name of correspondent
module.exports = ({correspondent}) => (  
  <div className="panel-title">{correspondent.firstName + ' '+ correspondent.lastName}</div>
);
