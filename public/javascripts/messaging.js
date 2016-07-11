var fudge = {
  correspondent: {
    lastName: 'Baratheon',
    firstName: 'Myrcella'
  },
  log: [
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

var Conversation = React.createClass({
  render: function() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <ConversationHeading correspondent={this.props.conversation.correspondent} />
        </div>

        <div className="panel-body conversation-panel">
          <MessageLog log={this.props.conversation.log}/>
          <div className="clearfix"></div>
        </div>

        <div className="panel-footer"> 
          <NewMessageInput />
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
  render: function() {
    var messagesArray=[];
    this.props.log.forEach(function(message){
      messagesArray.push(<MessageRow message={message} />)
    });
    return (
      <div className="messages-display">
        {messagesArray}
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
  render: function(){
    return (  
      <form className="new-message-form">
        <textarea placeholder="Your Message" className="form-control" required rows='6' />
        <div className="help-block small pull-right">Press enter to send.</div>
        <div className="clearfix"></div>
      </form>
    );
  }
});



ReactDOM.render(
  <Conversation conversation={fudge} />,document.getElementById('active-conversation')
);
