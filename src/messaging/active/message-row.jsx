var React = require('react');

var Helper = require('../helper.jsx');
var MessageContentBox = require('./message-content-box.jsx');

//assembles message display from date,  author, content
module.exports = ({message}) => (
  <div>
    <div className={'message '+(message.author==='Me' ? 'from-user' : 'to-user')}>
      <div className="message-header">
        <div className="message-author">{message.author}</div>
        <div className="clearfix"></div>
      </div>
      <MessageContentBox content={message.content} />
      <div className="clearfix"></div>
      <div className="message-time small">{Helper.datePrettify(message.msgTime)}</div>
    </div>
    <div className="clearfix">
    </div>
  </div>
);