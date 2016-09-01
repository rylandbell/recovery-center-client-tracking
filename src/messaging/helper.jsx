var React = require('react');

//When a message is sent, the MessageLog component should scroll to the bottom to show the new message
module.exports.scrollToBottom = function(){
  const node = this.log;
  node.parentNode.scrollTop = node.scrollHeight;
};

//Convert user-entered string to a message object:
module.exports.addMessageProps = function (enteredText){
  const fullMessage = {
    sender: "Me",
    timeSent: new Date().toISOString(),
    content: enteredText,
    seen: true,
    flagged: false
  };
  return fullMessage;
}

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
