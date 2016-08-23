var React = require('react');

var Helper = require('./helper.jsx');
var ConversationHeading = require('./conversation-heading.jsx');
var MessageLog = require('./message-log.jsx');
var NewMessageInput = require('./new-message-input.jsx');


//owns message array state, assembles subcomponents: 
module.exports = React.createClass({
  getInitialState: function() {
    return {messages: this.props.conversation.messages};
  },

  handleMessageSubmit: function(newMessage){
    var messageList = this.state.messages;
    messageList.push(newMessage);
    this.setState({messages: messageList});
  },

  render: function() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <ConversationHeading correspondent={this.props.conversation.correspondent} />
        </div>

        <div className="panel-body conversation-panel">
          <MessageLog messages={this.state.messages}/>
          <div className="clearfix"></div>
        </div>

        <div className="panel-footer"> 
          <NewMessageInput onMessageSubmit={this.handleMessageSubmit}/>
        </div>
      </div>
    );
  }
});
