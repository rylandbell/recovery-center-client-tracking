var React = require('react');
var fetch = require('isomorphic-fetch');

//When a message is sent, the MessageLog component should scroll to the bottom to show the new message
module.exports.scrollToBottom = function(){
  const node = this.log;
  node.parentNode.scrollTop = node.scrollHeight;
};

//Convert user-entered string to a message object:
module.exports.addMessageProps = function (enteredText){
  const fullMessage = {
    sender: "clinician",
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

module.exports.myFetch = function(url, method, successCallback, failureCallback){
  //Create headers with authorization token stored in cookie:
  const accessToken = JSON.parse(decodeURIComponent(document.cookie)
    .split(';')[1]
    .slice(6))
    .token;

  const myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer ' + accessToken);
  
  const myInit = {
    method: method,
    headers: myHeaders,
    // mode: 'cors',
    cache: 'default'
  };

  fetch(url,myInit)
    .then(response => response.json())
    .then(response => successCallback(response))
    .catch(response => failureCallback(response));
}

module.exports.sortByLastName = function(a,b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else if (a.lastName > b.lastName) {
    return 1;
  } else {
    return 0;
  }
}