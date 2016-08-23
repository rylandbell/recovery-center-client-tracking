var React = require('react');

//simply displays name of correspondent
module.exports = React.createClass({
  render: function(){
    var renderedName = this.props.correspondent.firstName + ' '+ this.props.correspondent.lastName;
    return (  
        <div className="panel-title">{renderedName}</div>
    );
  }
});