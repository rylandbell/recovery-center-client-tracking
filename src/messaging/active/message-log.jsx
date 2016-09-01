var React = require('react');

var Helper = require('../helper.jsx');
var MessageRow = require('./message-row.jsx');

//creates array of MessageRows
module.exports = React.createClass({
  componentDidUpdate: Helper.scrollToBottom,
  componentDidMount: Helper.scrollToBottom,
  render: function() {
    return (
      <div className="messages-display" ref={(c) => this.log = c}>
        {this.props.activeCorrespondence.messages.map((message,index) => <MessageRow message={message} correspondent={this.props.activeCorrespondence.correspondent} key={index}/>)}
      </div> 
    );
  }
});

