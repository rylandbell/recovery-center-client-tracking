var React = require('react');

var Helper = require('./helper.jsx');
var MessageRow = require('./message-row.jsx');

//creates array of MessageRows
module.exports = React.createClass({
  componentDidUpdate: Helper.scrollToBottom,
  componentDidMount: Helper.scrollToBottom,
  render: function() {
    var messageDivsArray=[];
    this.props.messages.forEach(function(message){
      messageDivsArray.push(<MessageRow message={message} />)
    });
    return (
      <div className="messages-display">
        {messageDivsArray}
      </div> 
    );
  }
});

