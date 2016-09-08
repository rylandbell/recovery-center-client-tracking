'use strict';

import React from 'react';
import fetch from 'isomorphic-fetch';

const api = {
  //When a message is sent, the MessageLog component should scroll to the bottom to show the new message
  scrollToBottom: function(){
    const node = this.log;
    node.parentNode.scrollTop = node.scrollHeight;
  },

  //Convert user-entered string to a message object:
  addMessageProps: function (enteredText){
    const fullMessage = {
      sender: "clinician",
      timeSent: new Date().toISOString(),
      content: enteredText,
      seen: true,
      flagged: false
    };
    return fullMessage;
  },

  //handles paragraph formatting for displayed messages
  formatMessage: function (message) {
    const paragraphArray = message.split('\n');
    const formattedMessage = [];
    paragraphArray.forEach(function(paragraph, index){
      formattedMessage.push(
        <p className='message-paragraph' key={index}>{paragraph}</p>
      );
    });
    return formattedMessage;
  },

  myFetch: function(url, method, successCallback, failureCallback){
    //Create headers with authorization token stored in cookie:
    const userCookie = document.cookie.slice(document.cookie.indexOf('user=')+5);
    const accessToken = JSON.parse(decodeURIComponent(userCookie)).token;

    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + accessToken);
    
    const myInit = {
      method: method,
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };

    fetch(url,myInit)
      .then(response => response.json())
      .then(response => successCallback(response))
      .catch(response => failureCallback(response));
  },

  sortByLastName: function(a,b) {
    if (a.lastName < b.lastName) {
      return -1;
    } else if (a.lastName > b.lastName) {
      return 1;
    } else {
      return 0;
    }
  }
}
export default api;