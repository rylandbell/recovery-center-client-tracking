var React = require('react');

//handles paragraph breaks in message text
module.exports = React.createClass({
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