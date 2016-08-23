(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');

//simply displays name of correspondent
module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var renderedName = this.props.correspondent.firstName + ' ' + this.props.correspondent.lastName;
    return React.createElement(
      'div',
      { className: 'panel-title' },
      renderedName
    );
  }
});

},{"react":"react"}],2:[function(require,module,exports){
'use strict';

var React = require('react');

var Helper = require('./helper.jsx');
var ConversationHeading = require('./conversation-heading.jsx');
var MessageLog = require('./message-log.jsx');
var NewMessageInput = require('./new-message-input.jsx');

//owns message array state, assembles subcomponents: 
module.exports = React.createClass({
  displayName: 'exports',

  getInitialState: function getInitialState() {
    return { messages: this.props.conversation.messages };
  },

  handleMessageSubmit: function handleMessageSubmit(newMessage) {
    var messageList = this.state.messages;
    messageList.push(newMessage);
    this.setState({ messages: messageList });
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'panel panel-primary' },
      React.createElement(
        'div',
        { className: 'panel-heading' },
        React.createElement(ConversationHeading, { correspondent: this.props.conversation.correspondent })
      ),
      React.createElement(
        'div',
        { className: 'panel-body conversation-panel' },
        React.createElement(MessageLog, { messages: this.state.messages }),
        React.createElement('div', { className: 'clearfix' })
      ),
      React.createElement(
        'div',
        { className: 'panel-footer' },
        React.createElement(NewMessageInput, { onMessageSubmit: this.handleMessageSubmit })
      )
    );
  }
});

},{"./conversation-heading.jsx":1,"./helper.jsx":4,"./message-log.jsx":7,"./new-message-input.jsx":9,"react":"react"}],3:[function(require,module,exports){
"use strict";

var React = require('react');

//Simply the checkbox; state and event handling managed by parent: NewMessageInput
module.exports = React.createClass({
  displayName: "exports",

  handleChange: function handleChange(e) {
    this.props.onCheckboxChange(e);
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "small pull-right" },
      React.createElement(
        "div",
        { className: "checkbox" },
        React.createElement(
          "label",
          null,
          React.createElement("input", { name: "isEmergencyContact", type: "checkbox", checked: this.props.isChecked, onChange: this.handleChange }),
          " Press enter to send"
        )
      )
    );
  }
});

},{"react":"react"}],4:[function(require,module,exports){
'use strict';

var ReactDOM = require('react-dom');

module.exports.scrollToBottom = function () {
  var node = ReactDOM.findDOMNode(this);
  node.parentNode.scrollTop = node.scrollHeight;
};

module.exports.addMessageProps = function (msgContent) {
  var fullMessage = {
    author: "Me",
    msgTime: new Date().toISOString(),
    content: msgContent,
    seen: true,
    flagged: false
  };
  return fullMessage;
};

module.exports.datePrettify = function (dateString) {
  var monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var year = dateString.substring(0, 4);
  var monthNumber = parseInt(dateString.substring(5, 7));
  var month = monthsList[monthNumber - 1];
  var day = dateString.substring(8, 10);

  var pretty = month + ' ' + day + ', ' + year;
  return pretty;
};

},{"react-dom":"react-dom"}],5:[function(require,module,exports){
'use strict';

// Conversation
//   ConversationHeading
//   MessageLog
//     [MessageRow]
//       MessageContentBox
//   NewMessageInput
//     EnterToSend

var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');

var Conversation = require('./conversation.jsx');

var fudge = {
  correspondent: {
    lastName: 'Baratheon',
    firstName: 'Myrcella'
  },
  messages: [{
    author: "Me",
    msgTime: '2016-05-16T17:45:40.276Z',
    content: 'Nothing ventured, nothing gained.',
    seen: true,
    flagged: false
  }, {
    author: "Myrcella",
    msgTime: '2016-06-16T17:45:40.276Z',
    content: 'Actually, ET is an ideal fit when you consider that Dame and cj were more or less responsible for 100% of the ball handling and playmaking for the Blazers last year. ET gives them a third facilitator and allows Dame and cj to operate off the ball (where they both excel) and allows them to get a bit more rest. We had to have at least one of them on the floor at all times last year. This gives us a LOT more flexibility.',
    seen: true,
    flagged: false
  }, {
    author: "Me",
    msgTime: '2016-07-16T17:45:40.276Z',
    content: 'sure',
    seen: true,
    flagged: false
  }]
};

ReactDOM.render(React.createElement(Conversation, { conversation: fudge }), document.getElementById('active-conversation'));

},{"./conversation.jsx":2,"react":"react","react-dom":"react-dom","redux":"redux"}],6:[function(require,module,exports){
'use strict';

var React = require('react');

//handles paragraph breaks in message text
module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var paragraphArray = this.props.content.split('\n');
    var formattedMessage = [];
    paragraphArray.forEach(function (paragraph) {
      formattedMessage.push(React.createElement(
        'p',
        { className: 'message-paragraph' },
        paragraph
      ));
    });
    return React.createElement(
      'div',
      { className: 'message-content pull-right' },
      formattedMessage
    );
  }
});

},{"react":"react"}],7:[function(require,module,exports){
'use strict';

var React = require('react');

var Helper = require('./helper.jsx');
var MessageRow = require('./message-row.jsx');

//creates array of MessageRows
module.exports = React.createClass({
  displayName: 'exports',

  componentDidUpdate: Helper.scrollToBottom,
  componentDidMount: Helper.scrollToBottom,
  render: function render() {
    var messageDivsArray = [];
    this.props.messages.forEach(function (message) {
      messageDivsArray.push(React.createElement(MessageRow, { message: message }));
    });
    return React.createElement(
      'div',
      { className: 'messages-display' },
      messageDivsArray
    );
  }
});

},{"./helper.jsx":4,"./message-row.jsx":8,"react":"react"}],8:[function(require,module,exports){
'use strict';

var React = require('react');
var Helper = require('./helper.jsx');
var MessageContentBox = require('./message-content-box.jsx');

//assembles message display from date,  author, content
module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'message ' + (this.props.message.author === 'Me' ? 'from-user' : 'to-user') },
        React.createElement(
          'div',
          { className: 'message-header' },
          React.createElement(
            'div',
            { className: 'message-author' },
            this.props.message.author
          ),
          React.createElement('div', { className: 'clearfix' })
        ),
        React.createElement(MessageContentBox, { content: this.props.message.content }),
        React.createElement('div', { className: 'clearfix' }),
        React.createElement(
          'div',
          { className: 'message-time small' },
          Helper.datePrettify(this.props.message.msgTime)
        )
      ),
      React.createElement('div', { className: 'clearfix' })
    );
  }
});

},{"./helper.jsx":4,"./message-content-box.jsx":6,"react":"react"}],9:[function(require,module,exports){
'use strict';

var React = require('react');

var EnterToSend = require('./enter-to-send.jsx');

//owns new message, enterToSend states; handles all form events
module.exports = React.createClass({
  displayName: 'exports',

  getInitialState: function getInitialState() {
    return {
      msgContent: '',
      enterToSend: true
    };
  },
  handleTextChange: function handleTextChange(e) {

    //typing only directly changes state, which in turn updates text in textarea field:
    e.preventDefault();
    this.setState({ msgContent: e.target.value });
  },
  handleCheckboxChange: function handleCheckboxChange(e) {
    this.setState({ enterToSend: e.target.checked });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.msgContent);
    if (!this.state.msgContent) {
      return;
    } else {

      //add a timestamp (etc.) and send the state to the parent Conversation component for processing:
      this.props.onMessageSubmit(Helper.addMessageProps(this.state.msgContent));

      //reset state, which in turn resets the form:
      this.setState({ msgContent: '' });
    };
  },
  sendWithEnter: function sendWithEnter(e) {
    if (e.charCode === 13 && this.state.enterToSend) {
      e.preventDefault();
      $('.new-message-form input[type="submit"]').click();
    }
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'new-message-form', onSubmit: this.handleSubmit },
      React.createElement('textarea', { placeholder: 'Your Message', className: 'form-control', required: true, rows: '6', value: this.state.msgContent, onChange: this.handleTextChange, onKeyPress: this.sendWithEnter }),
      React.createElement('input', { className: 'btn btn-primary', type: 'submit', value: 'Send' }),
      React.createElement(EnterToSend, { isChecked: this.state.enterToSend, onCheckboxChange: this.handleCheckboxChange }),
      React.createElement('div', { className: 'clearfix' })
    );
  }
});

},{"./enter-to-send.jsx":3,"react":"react"}]},{},[5]);
