var React = require('react');

//When a message is sent, the MessageLog component should scroll to the bottom to show the new message
module.exports.scrollToBottom = function(){
  var node = this.log;
  node.parentNode.scrollTop = node.scrollHeight;
};

//Convert user-entered string to a message object:
module.exports.addMessageProps = function (enteredText){
  var fullMessage = {
    author: "Me",
    msgTime: new Date().toISOString(),
    content: enteredText,
    seen: true,
    flagged: false
  };
  return fullMessage;
}

//converts 2009-08-22... to August 22, 2009
module.exports.datePrettify = function (dateString) {
  var monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var year = dateString.substring(0, 4);
  var monthNumber = parseInt(dateString.substring(5, 7));
  var month = monthsList[monthNumber - 1];
  var day = dateString.substring(8, 10);

  var pretty = month + ' ' + day + ', ' + year;
  return pretty;
};

//handles paragraph formatting for displayed messages
module.exports.formatMessage = function (message) {
  var paragraphArray = message.split('\n');
  var formattedMessage = [];
  paragraphArray.forEach(function(paragraph, index){
    formattedMessage.push(
      <p className='message-paragraph' key={index}>{paragraph}</p>
    );
  });
  return formattedMessage;
}
