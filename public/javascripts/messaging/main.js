(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');

//simply displays name of correspondent
module.exports = function (_ref) {
  var correspondent = _ref.correspondent;
  return React.createElement(
    'div',
    { className: 'panel-title' },
    correspondent.firstName + ' ' + correspondent.lastName
  );
};

},{"react":"react"}],2:[function(require,module,exports){
'use strict';

var React = require('react');
var ConversationHeading = require('./conversation-heading.jsx');
var MessageLog = require('./message-log.jsx');
var NewMessageInput = require('./new-message-input.jsx');

//owns message array state, assembles subcomponents: 
module.exports = function (_ref) {
  var reduxState = _ref.reduxState;
  var handleSubmit = _ref.handleSubmit;
  var handleTextChange = _ref.handleTextChange;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  var listenForEnter = _ref.listenForEnter;
  return React.createElement(
    'div',
    { className: 'panel panel-primary' },
    React.createElement(
      'div',
      { className: 'panel-heading' },
      React.createElement(ConversationHeading, { correspondent: reduxState.conversation.correspondent })
    ),
    React.createElement(
      'div',
      { className: 'panel-body conversation-panel' },
      React.createElement(MessageLog, { messages: reduxState.conversation.messages }),
      React.createElement('div', { className: 'clearfix' })
    ),
    React.createElement(
      'div',
      { className: 'panel-footer' },
      React.createElement(NewMessageInput, {
        enteredText: reduxState.enteredText,
        enterToSendStatus: reduxState.enterToSendStatus,
        handleSubmit: handleSubmit,
        handleTextChange: handleTextChange,
        handleCheckboxChange: handleCheckboxChange,
        listenForEnter: listenForEnter
      })
    )
  );
};

},{"./conversation-heading.jsx":1,"./message-log.jsx":8,"./new-message-input.jsx":10,"react":"react"}],3:[function(require,module,exports){
"use strict";

var React = require('react');

//Simply the checkbox; state and event handling managed by parent: NewMessageInput
module.exports = function (_ref) {
  var enterToSendStatus = _ref.enterToSendStatus;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  return React.createElement(
    "div",
    { className: "small pull-right" },
    React.createElement(
      "div",
      { className: "checkbox" },
      React.createElement(
        "label",
        null,
        React.createElement("input", { name: "isEmergencyContact", type: "checkbox", checked: enterToSendStatus, onChange: handleCheckboxChange }),
        " Press enter to send"
      )
    )
  );
};

},{"react":"react"}],4:[function(require,module,exports){
'use strict';

module.exports = {
  correspondent: {
    lastName: 'Name',
    firstName: 'Correspondent'
  },
  messages: [{
    author: "Me",
    msgTime: '2016-05-16T17:45:40.276Z',
    content: 'Nothing ventured, nothing gained.',
    seen: true,
    flagged: false
  }, {
    author: "Correspondent",
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

},{}],5:[function(require,module,exports){
'use strict';

var ReactDOM = require('react-dom');
var React = require('react');

//When a message is sent, the MessageLog component should scroll to the bottom to show the new message
module.exports.scrollToBottom = function () {
  var node = ReactDOM.findDOMNode(this);
  node.parentNode.scrollTop = node.scrollHeight;
};

//Convert user-entered string to a message object:
module.exports.addMessageProps = function (enteredText) {
  var fullMessage = {
    author: "Me",
    msgTime: new Date().toISOString(),
    content: enteredText,
    seen: true,
    flagged: false
  };
  return fullMessage;
};

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
  paragraphArray.forEach(function (paragraph, index) {
    formattedMessage.push(React.createElement(
      'p',
      { className: 'message-paragraph', key: index },
      paragraph
    ));
  });
  return formattedMessage;
};

},{"react":"react","react-dom":"react-dom"}],6:[function(require,module,exports){
'use strict';

// Conversation
//   ConversationHeading*
//   MessageLog
//     [MessageRow]*
//       MessageContentBox*
//   NewMessageInput*
//     EnterToSend*

var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var Helper = require('./helper.jsx');

var Reducers = require('./reducers.jsx');
var Conversation = require('./conversation.jsx');

var reduxStore = Redux.createStore(Reducers.parentReducer);
reduxStore.subscribe(render);
render();

function render() {
  ReactDOM.render(React.createElement(Conversation, {
    reduxState: reduxStore.getState(),
    handleTextChange: function handleTextChange(e) {
      e.preventDefault();
      if (e.charCode === 13 && reduxStore.getState().enterToSendStatus) {
        $('.new-message-form input[type="submit"]').click();
      }
      reduxStore.dispatch({
        type: 'TEXT_ENTRY',
        enteredText: e.target.value
      });
    },
    handleCheckboxChange: function handleCheckboxChange(e) {
      reduxStore.dispatch({
        type: 'CHECKBOX_UPDATE',
        checkboxValue: e.target.checked
      });
    },
    handleSubmit: function handleSubmit(e) {
      e.preventDefault();
      if (reduxStore.getState().enteredText === '') {
        return;
      } else {
        reduxStore.dispatch({
          type: 'SEND_MESSAGE',
          newMessage: Helper.addMessageProps(reduxStore.getState().enteredText)
        });
      }
    }
    //On each keypress, check for the case that Enter was pressed and enterToSendStatus is true:
    , listenForEnter: function listenForEnter(e) {
      if (e.charCode === 13 && reduxStore.getState().enterToSendStatus) {
        e.preventDefault();
        $('.new-message-form input[type="submit"]').click();
      }
    }
  }), document.getElementById('active-conversation'));
}

},{"./conversation.jsx":2,"./helper.jsx":5,"./reducers.jsx":11,"react":"react","react-dom":"react-dom","redux":"redux"}],7:[function(require,module,exports){
'use strict';

var React = require('react');
var Helper = require('./helper.jsx');

//handles paragraph breaks in message text
module.exports = function (_ref) {
    var content = _ref.content;
    return React.createElement(
        'div',
        { className: 'message-content pull-right' },
        Helper.formatMessage(content)
    );
};

},{"./helper.jsx":5,"react":"react"}],8:[function(require,module,exports){
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
    this.props.messages.forEach(function (message, index) {
      messageDivsArray.push(React.createElement(MessageRow, { message: message, key: index }));
    });
    return React.createElement(
      'div',
      { className: 'messages-display' },
      messageDivsArray
    );
  }
});

},{"./helper.jsx":5,"./message-row.jsx":9,"react":"react"}],9:[function(require,module,exports){
'use strict';

var React = require('react');
var Helper = require('./helper.jsx');
var MessageContentBox = require('./message-content-box.jsx');

//assembles message display from date,  author, content
module.exports = function (_ref) {
  var message = _ref.message;
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'message ' + (message.author === 'Me' ? 'from-user' : 'to-user') },
      React.createElement(
        'div',
        { className: 'message-header' },
        React.createElement(
          'div',
          { className: 'message-author' },
          message.author
        ),
        React.createElement('div', { className: 'clearfix' })
      ),
      React.createElement(MessageContentBox, { content: message.content }),
      React.createElement('div', { className: 'clearfix' }),
      React.createElement(
        'div',
        { className: 'message-time small' },
        Helper.datePrettify(message.msgTime)
      )
    ),
    React.createElement('div', { className: 'clearfix' })
  );
};

},{"./helper.jsx":5,"./message-content-box.jsx":7,"react":"react"}],10:[function(require,module,exports){
'use strict';

var React = require('react');
var EnterToSend = require('./enter-to-send.jsx');

//owns new message, enterToSend states; handles all form events
module.exports = function (_ref) {
  var handleSubmit = _ref.handleSubmit;
  var enteredText = _ref.enteredText;
  var handleTextChange = _ref.handleTextChange;
  var listenForEnter = _ref.listenForEnter;
  var enterToSendStatus = _ref.enterToSendStatus;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  return React.createElement(
    'form',
    { className: 'new-message-form', onSubmit: handleSubmit },
    React.createElement('textarea', { placeholder: 'Your Message', className: 'form-control', rows: '6', value: enteredText, onChange: handleTextChange, onKeyPress: listenForEnter }),
    React.createElement('input', { className: 'btn btn-primary', type: 'submit', value: 'Send' }),
    React.createElement(EnterToSend, { enterToSendStatus: enterToSendStatus, handleCheckboxChange: handleCheckboxChange }),
    React.createElement('div', { className: 'clearfix' })
  );
};

},{"./enter-to-send.jsx":3,"react":"react"}],11:[function(require,module,exports){
'use strict';

var fudge = require('./fudge.js');

module.exports.parentReducer = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {
    // conversation: {
    //   messages: [],
    //   correspondent: {
    //     firstName: '',
    //     lastName: ''
    //   }
    // }, 
    conversation: fudge,
    enteredText: '',
    enterToSendStatus: true
  } : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'TEXT_ENTRY':
      return Object.assign({}, state, { enteredText: action.enteredText });
    case 'CHECKBOX_UPDATE':
      return Object.assign({}, state, { enterToSendStatus: action.checkboxValue });
    case 'SEND_MESSAGE':
      var conversation = Object.assign({}, state.conversation);
      conversation.messages.push(action.newMessage);
      return Object.assign({}, state, { conversation: conversation, enteredText: '' });
    default:
      return state;
  }
};

},{"./fudge.js":4}]},{},[6]);
