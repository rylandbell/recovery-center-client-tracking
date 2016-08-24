var ReactDOM = require('react-dom');
var React = require('react');

module.exports.scrollToBottom = function(){
  var node = ReactDOM.findDOMNode(this);
  node.parentNode.scrollTop = node.scrollHeight;
};

module.exports.addMessageProps = function (msgContent){
  var fullMessage = {
    author: "Me",
    msgTime: new Date().toISOString(),
    content: msgContent,
    seen: true,
    flagged: false
  };
  return fullMessage;
}

module.exports.datePrettify = function (dateString) {
  var monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var year = dateString.substring(0, 4);
  var monthNumber = parseInt(dateString.substring(5, 7));
  var month = monthsList[monthNumber - 1];
  var day = dateString.substring(8, 10);

  var pretty = month + ' ' + day + ', ' + year;
  return pretty;
};

module.exports.formatMessage = function (message) {
  var paragraphArray = message.split('\n');
  var formattedMessage = [];
  paragraphArray.forEach(function(paragraph){
    formattedMessage.push(
      <p className='message-paragraph'>{paragraph}</p>
    );
  });
  return formattedMessage;
}