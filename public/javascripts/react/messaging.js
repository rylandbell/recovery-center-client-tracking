var fudge = {
  correspondent: {
    lastName: 'Baratheon',
    firstName: 'Myrcella'
  },
  messages: [
    {
      author: "Me",
      msgTime: 'February 25, 2016 - 3:04 PM',
      content: 'Nothing ventured, nothing gained.',
      seen: true,
      flagged: false
    },
    {
      author: "Myrcella",
      msgTime: 'March 4, 2016 - 12:04 PM',
      content: 'Actually, ET is an ideal fit when you consider that Dame and cj were more or less responsible for 100% of the ball handling and playmaking for the Blazers last year. ET gives them a third facilitator and allows Dame and cj to operate off the ball (where they both excel) and allows them to get a bit more rest. We had to have at least one of them on the floor at all times last year. This gives us a LOT more flexibility.',
      seen: true,
      flagged: false
    }
    ,
    {
      author: "Me",
      msgTime: 'March 5, 2016 - 3:04 PM',
      content: 'sure',
      seen: true,
      flagged: false
    }
  ]
};

// -------------React components---------------

var Conversation = React.createClass({
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

var ConversationHeading = React.createClass({
  render: function(){
    var renderedName = this.props.correspondent.firstName + ' '+ this.props.correspondent.lastName;
    return (  
        <div className="panel-title">{renderedName}</div>
    );
  }
});

var MessageLog = React.createClass({
  componentDidUpdate: scrollToBottom,
  componentDidMount: scrollToBottom,
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

var MessageRow = React.createClass({
  render: function() {
    return (
      <div>
        <div className={'message '+(this.props.message.author==='Me' ? 'from-user' : 'to-user')}>
          <div className="message-header">
            <div className="message-author">{this.props.message.author}</div>
            <div className="clearfix"></div>
          </div>
          <div className="message-content pull-right">{this.props.message.content}</div>
          <div className="clearfix"></div>
          <div className="message-time small">{this.props.message.msgTime}</div>
        </div>
        <div className="clearfix">
        </div>
      </div>
    );
  }
});

var NewMessageInput = React.createClass({
  getInitialState: function() {
    return {
      msgContent: '',
      enterToSend: true
    };
  },
  handleTextChange: function(e) {

    //typing only directly changes state, which in turn updates text in textarea field:
    e.preventDefault();
    this.setState({msgContent: e.target.value});
  },
  handleCheckboxChange: function(e) {
    this.setState({enterToSend: e.target.checked});
  },
  handleSubmit: function(e){
    e.preventDefault();
    if(!this.state.msgContent){
      return;
    } else {

      //add a timestamp (etc.) and send the state to the parent Conversation component for processing:
      this.props.onMessageSubmit(
        addMessageProps(this.state.msgContent)
      );

      //reset state, which in turn resets the form:
      this.setState({msgContent: ''});
    };
  },
  sendWithEnter: function(e){
    if(e.charCode===13 && this.state.enterToSend){
      e.preventDefault();
      $('.new-message-form input[type="submit"]').click();
    }
  },
  render: function(){
    return (
      <form className="new-message-form" onSubmit={this.handleSubmit}>
        <textarea placeholder="Your Message" className="form-control" required rows='6' value={this.state.msgContent} onChange={this.handleTextChange} onKeyPress={this.sendWithEnter}/>
        <input className='btn btn-primary' type='submit' value='Send' />
        <EnterToSend isChecked={this.state.enterToSend} onCheckboxChange={this.handleCheckboxChange} />
        <div className="clearfix"></div>
      </form>
    );
  }
});

var EnterToSend = React.createClass({
  handleChange: function(e){
    this.props.onCheckboxChange(e);
  },
  render: function() {
    return (
      <div className="small pull-right">
        <div className="checkbox">
          <label>
            <input name="isEmergencyContact" type="checkbox" checked={this.props.isChecked} onChange={this.handleChange} />&nbsp;Press enter to send
          </label>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Conversation conversation={fudge} />,document.getElementById('active-conversation')
);

// -------Helper functions---------
function scrollToBottom(){
  var node = ReactDOM.findDOMNode(this);
  node.parentNode.scrollTop = node.scrollHeight;
};

function addMessageProps(msgContent){
  var fullMessage = {
    author: "Me",
    msgTime: new Date().toISOString(),
    content: msgContent,
    seen: true,
    flagged: false
  };
  return fullMessage;
}