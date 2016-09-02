var React = require('react');

var MessageContentBox = require('./message-content-box.jsx');

//assembles message display from date,  sender, content
module.exports = ({message, correspondent}) => (
  <div>
    <div className={'message '+(message.sender==='clinician' ? 'from-user' : 'to-user')}>
      <div className="message-header">
        <div className="message-author">{message.sender==='clinician' ? 'Me' : correspondent.firstName}</div>
        <div className="clearfix"></div>
      </div>
      <MessageContentBox content={message.content} />
      <div className="clearfix"></div>
      <div className="message-time small">{moment(message.timeSent).format('MMM D, YYYY. h:mm A')}</div>
    </div>
    <div className="clearfix">
    </div>
  </div>
);
