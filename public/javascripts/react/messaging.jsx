var fudge = {
  correspondent: {
    lastName: 'Baratheon',
    firstName: 'Myrcella'
  },
  messages: [
    {
      author: "Me",
      msgTime: '2016-05-16T17:45:40.276Z',
      content: 'Nothing ventured, nothing gained.',
      seen: true,
      flagged: false
    },
    {
      author: "Myrcella",
      msgTime: '2016-06-16T17:45:40.276Z',
      content: 'Actually, ET is an ideal fit when you consider that Dame and cj were more or less responsible for 100% of the ball handling and playmaking for the Blazers last year. ET gives them a third facilitator and allows Dame and cj to operate off the ball (where they both excel) and allows them to get a bit more rest. We had to have at least one of them on the floor at all times last year. This gives us a LOT more flexibility.',
      seen: true,
      flagged: false
    }
    ,
    {
      author: "Me",
      msgTime: '2016-07-16T17:45:40.276Z',
      content: 'sure',
      seen: true,
      flagged: false
    }
  ]
};

// -------------React components---------------

//owns message array state, assembles subcomponents: 
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

//simply displays name of correspondent
var ConversationHeading = React.createClass({
  render: function(){
    var renderedName = this.props.correspondent.firstName + ' '+ this.props.correspondent.lastName;
    return (  
        <div className="panel-title">{renderedName}</div>
    );
  }
});

//creates array of MessageRows
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

//assembles message display from date, author, content
var MessageRow = React.createClass({
  render: function() {
    return (
      <div>
        <div className={'message '+(this.props.message.author==='Me' ? 'from-user' : 'to-user')}>
          <div className="message-header">
            <div className="message-author">{this.props.message.author}</div>
            <div className="clearfix"></div>
          </div>
          <MessageContentBox content={this.props.message.content} />
          <div className="clearfix"></div>
          <div className="message-time small">{datePrettify(this.props.message.msgTime)}</div>
        </div>
        <div className="clearfix">
        </div>
      </div>
    );
  }
});

//handles paragraph breaks in message text
var MessageContentBox = React.createClass({
  render: function() {
    var paragraphArray = this.props.content.split('\n');
    var formattedMessage = [];
    paragraphArray.forEach(function(paragraph){
      formattedMessage.push(
          <p className='message-paragraph'>{paragraph}</p>
      );
    });
    return (
      <div className="message-content pull-right">{formattedMessage}</div>
    );
  }
});

//owns new message, enterToSend states; handles all form events
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
    console.log(this.state.msgContent);
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

//Simply the checkbox; state and event handling managed by parent: NewMessageInput
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

function datePrettify (dateString) {
  var monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var year = dateString.substring(0, 4);
  var monthNumber = parseInt(dateString.substring(5, 7));
  var month = monthsList[monthNumber - 1];
  var day = dateString.substring(8, 10);

  var pretty = month + ' ' + day + ', ' + year;
  return pretty;
};