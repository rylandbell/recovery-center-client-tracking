var React = require('react');
var Helper = require('./helper.jsx');
var ConversationHeading = require('./conversation-heading.jsx');
var MessageLog = require('./message-log.jsx');
var NewMessageInput = require('./new-message-input.jsx');


//owns message array state, assembles subcomponents: 
module.exports = React.createClass({
  getInitialState: function() {
    return {
      messages: this.props.conversation.messages,
      msgContent: ''
    };
  },

  handleMessageSubmit: function(newMessage){
    var messageList = this.state.messages;
    messageList.push(newMessage);
    this.setState({messages: messageList});
  },

  handleSubmit: function(e){
    e.preventDefault();
    if(!this.state.msgContent){
      return;
    } else {
      //add a timestamp (etc.) and send the state to the parent Conversation component for processing:
      this.handleMessageSubmit(
        Helper.addMessageProps(this.state.msgContent)
      );

      //reset state, which in turn resets the form:
      this.setState({msgContent: ''});
      
    }
  },

  handleTextChange: function(e) {
    //typing only directly changes state, which in turn updates text in textarea field:
    e.preventDefault();
    this.setState({msgContent: e.target.value});
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
          <NewMessageInput msgContent={this.state.msgContent} onMessageSubmit={this.handleMessageSubmit} handleSubmit={this.handleSubmit} handleTextChange = {this.handleTextChange}/>
        </div>
      </div>
    );
  }
});
