var React = require('react');
var Helper = require('./helper.jsx');
var MessageContentBox = require('./message-content-box.jsx');

//assembles message display from date,  author, content
module.exports = React.createClass({
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
          <div className="message-time small">{Helper.datePrettify(this.props.message.msgTime)}</div>
        </div>
        <div className="clearfix">
        </div>
      </div>
    );
  }
});