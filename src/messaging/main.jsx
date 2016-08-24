// Conversation
//   ConversationHeading*
//   MessageLog
//     [MessageRow]*
//       MessageContentBox*
//   NewMessageInput
//     EnterToSend*

var React = require('react');
var ReactDOM = require('react-dom');
// var Redux = require('redux');

var Conversation = require('./conversation.jsx');

var fudge = {
  correspondent: {
    lastName: 'Baratheon',
    firstName: 'Myrcella'
  },
  messages: [
    {
      author: "Me",
      msgTime: '2016-05-16T17:45:40.276Z',
      content: 'Nothing ventured, nothing gained.',
      seen: true,
      flagged: false
    },
    {
      author: "Myrcella",
      msgTime: '2016-06-16T17:45:40.276Z',
      content: 'Actually, ET is an ideal fit when you consider that Dame and cj were more or less responsible for 100% of the ball handling and playmaking for the Blazers last year. ET gives them a third facilitator and allows Dame and cj to operate off the ball (where they both excel) and allows them to get a bit more rest. We had to have at least one of them on the floor at all times last year. This gives us a LOT more flexibility.',
      seen: true,
      flagged: false
    }
    ,
    {
      author: "Me",
      msgTime: '2016-07-16T17:45:40.276Z',
      content: 'sure',
      seen: true,
      flagged: false
    }
  ]
};

ReactDOM.render(
  <Conversation
    conversation={fudge}


  /> ,
  document.getElementById('active-conversation')
);

