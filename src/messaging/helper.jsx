var React = require('react');

//When a message is sent, the MessageLog component should scroll to the bottom to show the new message
module.exports.scrollToBottom = function(){
  const node = this.log;
  node.parentNode.scrollTop = node.scrollHeight;
};

//Convert user-entered string to a message object:
module.exports.addMessageProps = function (enteredText){
  const fullMessage = {
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
  const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const year = dateString.substring(0, 4);
  const monthNumber = parseInt(dateString.substring(5, 7));
  const month = monthsList[monthNumber - 1];
  const day = dateString.substring(8, 10);

  const pretty = month + ' ' + day + ', ' + year;
  return pretty;
};

//handles paragraph formatting for displayed messages
module.exports.formatMessage = function (message) {
  const paragraphArray = message.split('\n');
  const formattedMessage = [];
  paragraphArray.forEach(function(paragraph, index){
    formattedMessage.push(
      <p className='message-paragraph' key={index}>{paragraph}</p>
    );
  });
  return formattedMessage;
}
