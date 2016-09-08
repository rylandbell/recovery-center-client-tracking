(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":2}],2:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var api = {
  selectCorrespondence: function selectCorrespondence(id) {
    return {
      type: 'SELECT_CORRESPONDENCE',
      id: id
    };
  },

  textEntry: function textEntry(text) {
    return {
      type: 'TEXT_ENTRY',
      enteredText: text
    };
  },

  checkboxUpdate: function checkboxUpdate(newValue) {
    return {
      type: 'CHECKBOX_UPDATE',
      checkboxValue: newValue
    };
  },

  sendMessage: function sendMessage(newMessageObject) {
    return {
      type: 'SEND_MESSAGE',
      newMessage: newMessageObject
    };
  },

  //~~~~~~Actions surround AJAX requests for client list:~~~~~~

  requestClientList: function requestClientList() {
    return {
      type: 'GET_CLIENT_LIST'
    };
  },

  receiveClientList: function receiveClientList(response) {
    return {
      type: 'RECEIVE_CLIENT_LIST',
      list: response
    };
  },

  requestClientListWaiting: function requestClientListWaiting() {
    return {
      type: 'REQUEST_CLIENT_LIST_WAITING'
    };
  },

  requestClientListFailure: function requestClientListFailure() {
    return {
      type: 'REQUEST_CLIENT_LIST_FAILURE'
    };
  },

  // ~~~~~~~~~~~~~~~~~~~~~~

  selectClientRow: function selectClientRow(id) {
    return {
      type: 'SELECT_CLIENT_ROW',
      id: id
    };
  },

  addNewCorrespondence: function addNewCorrespondence() {
    return {
      type: 'ADD_NEW_CORRESPONDENCE'
    };
  }
};

exports.default = api;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _conversationHeading = require('./conversation-heading.jsx');

var _conversationHeading2 = _interopRequireDefault(_conversationHeading);

var _messageLog = require('./message-log.jsx');

var _messageLog2 = _interopRequireDefault(_messageLog);

var _newMessageInput = require('./new-message-input.jsx');

var _newMessageInput2 = _interopRequireDefault(_newMessageInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//owns message array state, assembles subcomponents: 
var api = function api(_ref) {
  var activeCorrespondence = _ref.activeCorrespondence;
  var enteredText = _ref.enteredText;
  var enterToSendStatus = _ref.enterToSendStatus;
  var handleSubmit = _ref.handleSubmit;
  var handleTextChange = _ref.handleTextChange;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  var listenForEnter = _ref.listenForEnter;
  return _react2.default.createElement(
    'div',
    { className: 'panel panel-primary' },
    _react2.default.createElement(
      'div',
      { className: 'panel-heading' },
      _react2.default.createElement(_conversationHeading2.default, { correspondent: activeCorrespondence.correspondent })
    ),
    _react2.default.createElement(
      'div',
      { className: 'panel-body conversation-panel' },
      _react2.default.createElement(_messageLog2.default, { activeCorrespondence: activeCorrespondence }),
      _react2.default.createElement('div', { className: 'clearfix' })
    ),
    _react2.default.createElement(
      'div',
      { className: 'panel-footer' },
      _react2.default.createElement(_newMessageInput2.default, {
        enteredText: enteredText,
        enterToSendStatus: enterToSendStatus,
        handleSubmit: handleSubmit,
        handleTextChange: handleTextChange,
        handleCheckboxChange: handleCheckboxChange,
        listenForEnter: listenForEnter
      })
    )
  );
};

exports.default = api;

},{"./conversation-heading.jsx":6,"./message-log.jsx":9,"./new-message-input.jsx":11,"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//simply displays name of correspondent
var api = function api(_ref) {
  var correspondent = _ref.correspondent;
  return _react2.default.createElement(
    'div',
    { className: 'panel-title' },
    correspondent.firstName + ' ' + correspondent.lastName
  );
};

exports.default = api;

},{"react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Simply the checkbox; state and event handling managed by parent: NewMessageInput
var api = function api(_ref) {
  var enterToSendStatus = _ref.enterToSendStatus;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  return _react2.default.createElement(
    'div',
    { className: 'small pull-right' },
    _react2.default.createElement(
      'div',
      { className: 'checkbox' },
      _react2.default.createElement(
        'label',
        null,
        _react2.default.createElement('input', { name: 'isEmergencyContact', type: 'checkbox', checked: enterToSendStatus, onChange: handleCheckboxChange }),
        ' Press enter to send'
      )
    )
  );
};

exports.default = api;

},{"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _helper = require('../../helper.jsx');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//handles paragraph breaks in message text
var api = function api(_ref) {
    var content = _ref.content;
    return _react2.default.createElement(
        'div',
        { className: 'message-content pull-right' },
        _helper2.default.formatMessage(content)
    );
};

exports.default = api;

},{"../../helper.jsx":25,"react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _helper = require('../../helper.jsx');

var _helper2 = _interopRequireDefault(_helper);

var _messageRow = require('./message-row.jsx');

var _messageRow2 = _interopRequireDefault(_messageRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//creates array of MessageRows
var api = _react2.default.createClass({
  displayName: 'api',

  componentDidUpdate: _helper2.default.scrollToBottom,
  componentDidMount: _helper2.default.scrollToBottom,
  render: function render() {
    var _this = this;

    return _react2.default.createElement(
      'div',
      { className: 'messages-display', ref: function ref(c) {
          return _this.log = c;
        } },
      this.props.activeCorrespondence.messages.map(function (message, index) {
        return _react2.default.createElement(_messageRow2.default, { message: message, correspondent: _this.props.activeCorrespondence.correspondent, key: index });
      })
    );
  }
});

exports.default = api;

},{"../../helper.jsx":25,"./message-row.jsx":10,"react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _messageContentBox = require('./message-content-box.jsx');

var _messageContentBox2 = _interopRequireDefault(_messageContentBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//assembles message display from date,  sender, content
var api = function api(_ref) {
  var message = _ref.message;
  var correspondent = _ref.correspondent;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { className: 'message ' + (message.sender === 'clinician' ? 'from-user' : 'to-user') },
      _react2.default.createElement(
        'div',
        { className: 'message-header' },
        _react2.default.createElement(
          'div',
          { className: 'message-author' },
          message.sender === 'clinician' ? 'Me' : correspondent.firstName
        ),
        _react2.default.createElement('div', { className: 'clearfix' })
      ),
      _react2.default.createElement(_messageContentBox2.default, { content: message.content }),
      _react2.default.createElement('div', { className: 'clearfix' }),
      _react2.default.createElement(
        'div',
        { className: 'message-time small' },
        moment(message.timeSent).format('MMM D, YYYY. h:mm A')
      )
    ),
    _react2.default.createElement('div', { className: 'clearfix' })
  );
};

exports.default = api;

},{"./message-content-box.jsx":8,"react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enterToSend = require('./enter-to-send.jsx');

var _enterToSend2 = _interopRequireDefault(_enterToSend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//owns new message, enterToSend states; handles all form events
var api = function api(_ref) {
  var handleSubmit = _ref.handleSubmit;
  var enteredText = _ref.enteredText;
  var handleTextChange = _ref.handleTextChange;
  var listenForEnter = _ref.listenForEnter;
  var enterToSendStatus = _ref.enterToSendStatus;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  return _react2.default.createElement(
    'form',
    { className: 'new-message-form', onSubmit: handleSubmit },
    _react2.default.createElement('textarea', { placeholder: 'Your Message', className: 'form-control', rows: '6', value: enteredText, onChange: handleTextChange, onKeyPress: listenForEnter }),
    _react2.default.createElement('input', { className: 'btn btn-primary', type: 'submit', value: 'Send' }),
    _react2.default.createElement(_enterToSend2.default, { enterToSendStatus: enterToSendStatus, handleCheckboxChange: handleCheckboxChange }),
    _react2.default.createElement('div', { className: 'clearfix' })
  );
};

exports.default = api;

},{"./enter-to-send.jsx":7,"react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _activeConversation = require('../active-conversation/active-conversation.jsx');

var _activeConversation2 = _interopRequireDefault(_activeConversation);

var _actionCreators = require('../../action-creators.jsx');

var _actionCreators2 = _interopRequireDefault(_actionCreators);

var _helper = require('../../helper.jsx');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    activeCorrespondence: state.activeCorrespondence,
    enterToSendStatus: state.enterToSendStatus,
    enteredText: state.enteredText
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleTextChange: function handleTextChange(e) {
      e.preventDefault();
      dispatch(_actionCreators2.default.textEntry(e.target.value));
    },
    handleCheckboxChange: function handleCheckboxChange(e) {
      dispatch(_actionCreators2.default.checkboxUpdate(e.target.checked));
    },
    handleSubmit: function handleSubmit(e) {
      e.preventDefault();
      if (ownProps.reduxState.enteredText === '') {
        return;
      } else {
        dispatch(_actionCreators2.default.sendMessage(_helper2.default.addMessageProps(ownProps.reduxState.enteredText)));
      }
    },
    listenForEnter: function listenForEnter(e) {
      if (e.charCode === 13 && ownProps.reduxState.enterToSendStatus) {
        e.preventDefault();
        $('.new-message-form input[type="submit"]').click();
      }
    }
  };
};

var api = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_activeConversation2.default);

exports.default = api;

},{"../../action-creators.jsx":4,"../../helper.jsx":25,"../active-conversation/active-conversation.jsx":5,"react-redux":"react-redux"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _conversationSelector = require('../selector/conversation-selector.jsx');

var _conversationSelector2 = _interopRequireDefault(_conversationSelector);

var _actionCreators = require('../../action-creators.jsx');

var _actionCreators2 = _interopRequireDefault(_actionCreators);

var _helper = require('../../helper.jsx');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    listOfCorrespondences: state.listOfCorrespondences,
    activeId: state.activeCorrespondence.correspondenceId
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    selectCorrespondence: function selectCorrespondence(newCorrespondenceId) {
      dispatch(_actionCreators2.default.selectCorrespondence(newCorrespondenceId));
    },
    requestClientList: function requestClientList() {
      _helper2.default.myFetch('http://dreamriverdigital.com/wasatch/client/get', 'GET', function (response) {
        dispatch(_actionCreators2.default.receiveClientList(response));
      }, function (response) {
        console.log(response);
      });
      dispatch(_actionCreators2.default.requestClientListWaiting());
    }
  };
};

var api = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_conversationSelector2.default);

exports.default = api;

},{"../../action-creators.jsx":4,"../../helper.jsx":25,"../selector/conversation-selector.jsx":19,"react-redux":"react-redux"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _newCorrespondentModal = require('../selector/new-correspondent-modal.jsx');

var _newCorrespondentModal2 = _interopRequireDefault(_newCorrespondentModal);

var _actionCreators = require('../../action-creators.jsx');

var _actionCreators2 = _interopRequireDefault(_actionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    clientList: state.clientList,
    selectedClientRow: state.selectedClientRow
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    selectClientRow: function selectClientRow(id) {
      dispatch(_actionCreators2.default.selectClientRow(id));
    },
    addNewCorrespondence: function addNewCorrespondence() {
      dispatch(_actionCreators2.default.addNewCorrespondence());
    }
  };
};

var api = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_newCorrespondentModal2.default);

exports.default = api;

},{"../../action-creators.jsx":4,"../selector/new-correspondent-modal.jsx":22,"react-redux":"react-redux"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _conversationSelectorContainer = require('./containers/conversation-selector-container.jsx');

var _conversationSelectorContainer2 = _interopRequireDefault(_conversationSelectorContainer);

var _activeConversationContainer = require('./containers/active-conversation-container.jsx');

var _activeConversationContainer2 = _interopRequireDefault(_activeConversationContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var reduxState = _ref.reduxState;
  return _react2.default.createElement(
    'div',
    { className: 'row' },
    _react2.default.createElement(
      'div',
      { className: 'col-xs-12 col-sm-5 col-lg-3' },
      _react2.default.createElement(_conversationSelectorContainer2.default, null)
    ),
    _react2.default.createElement(
      'div',
      { className: 'col-xs-12 col-sm-7 col-lg-8 col-lg-offset-1' },
      _react2.default.createElement(_activeConversationContainer2.default, { reduxState: reduxState })
    )
  );
};

exports.default = api;

},{"./containers/active-conversation-container.jsx":12,"./containers/conversation-selector-container.jsx":13,"react":"react"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var addNewCorrespondence = _ref.addNewCorrespondence;
  return _react2.default.createElement(
    'button',
    { className: 'btn btn-primary', onClick: addNewCorrespondence, 'data-dismiss': 'modal' },
    ' Add Selected Client'
  );
};

exports.default = api;

},{"react":"react"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var client = _ref.client;
  var selectedClientRow = _ref.selectedClientRow;
  var selectClientRow = _ref.selectClientRow;

  var handleClick = function handleClick() {
    selectClientRow(client.id);
  };
  return _react2.default.createElement(
    'tr',
    { onClick: handleClick, className: client.id === selectedClientRow ? 'active' : '' },
    _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement('input', { type: 'radio', name: 'optionsRadios', id: 'optionsRadios1', value: client.id, checked: client.id === selectedClientRow })
    ),
    _react2.default.createElement(
      'td',
      null,
      ' ',
      client.lastName,
      ', ',
      client.firstName,
      ' '
    )
  );
};

exports.default = api;

},{"react":"react"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _clientRow = require('./client-row.jsx');

var _clientRow2 = _interopRequireDefault(_clientRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var clientList = _ref.clientList;
  var selectedClientRow = _ref.selectedClientRow;
  var selectClientRow = _ref.selectClientRow;
  return _react2.default.createElement(
    'form',
    { className: 'form center-block', id: 'client-table', action: '#', method: 'post', role: 'form', autoComplete: 'off', noValidate: true },
    _react2.default.createElement(
      'table',
      { className: 'table table-hover table-condensed ', id: 'client-table' },
      _react2.default.createElement(
        'tbody',
        null,
        clientList.list.map(function (client, index) {
          return _react2.default.createElement(_clientRow2.default, { client: client, key: index, selectedClientRow: selectedClientRow, selectClientRow: selectClientRow });
        })
      )
    )
  );
};

exports.default = api;

},{"./client-row.jsx":17,"react":"react"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _showModalButton = require('./show-modal-button.jsx');

var _showModalButton2 = _interopRequireDefault(_showModalButton);

var _newCorrespondentModalContainer = require('../containers/new-correspondent-modal-container.jsx');

var _newCorrespondentModalContainer2 = _interopRequireDefault(_newCorrespondentModalContainer);

var _correspondentList = require('./correspondent-list.jsx');

var _correspondentList2 = _interopRequireDefault(_correspondentList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var listOfCorrespondences = _ref.listOfCorrespondences;
  var activeId = _ref.activeId;
  var selectCorrespondence = _ref.selectCorrespondence;
  var requestClientList = _ref.requestClientList;

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { className: 'conversation-list' },
      _react2.default.createElement(
        'h4',
        { className: 'text-center' },
        'My Correspondents'
      ),
      _react2.default.createElement('hr', null),
      _react2.default.createElement(_correspondentList2.default, { listOfCorrespondences: listOfCorrespondences, activeId: activeId, selectCorrespondence: selectCorrespondence }),
      _react2.default.createElement('hr', null),
      _react2.default.createElement(_showModalButton2.default, { handleClick: requestClientList })
    ),
    _react2.default.createElement(_newCorrespondentModalContainer2.default, null)
  );
};

exports.default = api;

},{"../containers/new-correspondent-modal-container.jsx":14,"./correspondent-list.jsx":20,"./show-modal-button.jsx":23,"react":"react"}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _correspondentRow = require('./correspondent-row.jsx');

var _correspondentRow2 = _interopRequireDefault(_correspondentRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var listOfCorrespondences = _ref.listOfCorrespondences;
  var activeId = _ref.activeId;
  var selectCorrespondence = _ref.selectCorrespondence;
  return _react2.default.createElement(
    'ul',
    { className: 'nav nav-pills nav-stacked' },
    listOfCorrespondences.map(function (correspondence, index) {
      return _react2.default.createElement(_correspondentRow2.default, { correspondence: correspondence, activeId: activeId, key: index, selectCorrespondence: selectCorrespondence });
    })
  );
};

exports.default = api;

},{"./correspondent-row.jsx":21,"react":"react"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var correspondence = _ref.correspondence;
  var activeId = _ref.activeId;
  var selectCorrespondence = _ref.selectCorrespondence;

  function handleClick() {
    selectCorrespondence(correspondence.id);
  }
  return _react2.default.createElement(
    'li',
    { role: 'presentation', className: activeId === correspondence.id ? 'active' : '', onClick: handleClick },
    _react2.default.createElement(
      'a',
      { href: '#' },
      correspondence.client.lastName,
      ', ',
      correspondence.client.firstName,
      '   ',
      correspondence.clinician.flagged ? _react2.default.createElement('span', { className: 'glyphicon glyphicon-envelope' }) : null,
      _react2.default.createElement(
        'div',
        { className: 'small pull-right' },
        correspondence.client.currentLevelOfCare
      )
    )
  );
};

exports.default = api;

},{"react":"react"}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _addCorrespondentButton = require('./add-correspondent-button.jsx');

var _addCorrespondentButton2 = _interopRequireDefault(_addCorrespondentButton);

var _clientTable = require('./client-table.jsx');

var _clientTable2 = _interopRequireDefault(_clientTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var clientList = _ref.clientList;
  var selectedClientRow = _ref.selectedClientRow;
  var selectClientRow = _ref.selectClientRow;
  var addNewCorrespondence = _ref.addNewCorrespondence;
  return _react2.default.createElement(
    'div',
    { tabIndex: '-1', role: 'dialog', 'aria-labelledby': 'myModalLabel', id: 'new-conversation-modal', className: 'modal fade' },
    _react2.default.createElement(
      'div',
      { role: 'document', className: 'modal-dialog' },
      _react2.default.createElement(
        'div',
        { className: 'modal-content' },
        _react2.default.createElement(
          'div',
          { className: 'modal-header' },
          _react2.default.createElement(
            'button',
            { className: 'close', type: 'button', 'data-dismiss': 'modal', 'aria-label': 'Close' },
            _react2.default.createElement(
              'span',
              { 'aria-hidden': 'true' },
              ' × '
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'modal-title' },
            _react2.default.createElement(
              'h4',
              null,
              'Add New Correspondent'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'modal-body' },
          _react2.default.createElement(_clientTable2.default, { clientList: clientList, selectedClientRow: selectedClientRow, selectClientRow: selectClientRow })
        ),
        _react2.default.createElement(
          'div',
          { className: 'modal-footer' },
          _react2.default.createElement(_addCorrespondentButton2.default, { addNewCorrespondence: addNewCorrespondence })
        )
      )
    )
  );
};

exports.default = api;

},{"./add-correspondent-button.jsx":16,"./client-table.jsx":18,"react":"react"}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = function api(_ref) {
  var handleClick = _ref.handleClick;
  return _react2.default.createElement(
    'button',
    { 'data-toggle': 'modal', 'data-target': '#new-conversation-modal', className: 'btn btn-success center-block', onClick: handleClick },
    _react2.default.createElement('span', { className: 'glyphicon glyphicon-plus' }),
    '  Add Correspondent'
  );
};

exports.default = api;

},{"react":"react"}],24:[function(require,module,exports){
'use strict';

var corr1 = {
  id: 1,
  clinician: {
    id: 13,
    firstName: 'Travis',
    lastName: 'Outlaw',
    flagged: false
  },
  client: {
    id: 109,
    firstName: 'George',
    lastName: 'Washington',
    currentLevelOfCare: 'IOP',
    flagged: false
  },
  messages: [{
    sender: 'clinician',
    timeSent: '2016-05-16T17:45:40.276Z',
    content: 'One family went so far as to rename their toddler son, telling People “we just felt like, this does not at all encompass the values that we want for our son to have and know.” And so, at 14 months, Atticus became Lucas.'
  }, {
    sender: 'client',
    timeSent: '2016-06-16T17:45:40.276Z',
    content: 'But the survey found that mothers’ top reason for onomastic discontent was that they hadn’t been bold enough; 25 percent said the name they chose was too common, and 11 percent said it was not distinctive enough. It’s hard to imagine “James” being the cause of such angst, but this is an era in which blending in too much is as horrifying as standing out.'
  }, {
    sender: 'clinician',
    timeSent: '2016-07-16T17:45:40.276Z',
    content: 'This is the kind of thing I would only ever tell George Washington.'
  }]
};

var corr2 = {
  id: 12,
  clinician: {
    id: 13,
    firstName: 'Travis',
    lastName: 'Outlaw',
    flagged: true
  },
  client: {
    id: 109,
    firstName: 'John',
    lastName: 'Adams',
    currentLevelOfCare: 'RTC',
    flagged: false
  },
  messages: [{
    sender: 'clinician',
    timeSent: '2016-05-16T17:45:40.276Z',
    content: ' One day in a research meeting, in the spring of 1985, he and another postdoc, Leonard Martin, heard a presentation on the topic. Lots of studies found that if you asked someone to smile, she’d say she felt more happy or amused, and her body would react in kind. It appeared to be a small but reliable effect.'
  }, {
    sender: 'client',
    timeSent: '2016-06-16T17:45:40.276Z',
    content: 'He told a group of students that he wanted to record the activity of their facial muscles under various conditions, and then he hooked silver cup electrodes to the corners of their mouths, the edges of their jaws, and the space between their eyebrows. The wires from the electrodes plugged into a set of fancy but nonfunctional gizmos.'
  }, {
    sender: 'clinician',
    timeSent: '2016-07-16T17:45:40.276Z',
    content: 'This is the kind of thing I would only ever tell John Adams.'
  }]
};

module.exports = [corr1, corr2];

// Message: {
//   sender: 'clinician' or ‘client’
//   content: 'Dear Diary,...',
//   timeSent: ‘2016-08-30T12:00:00Z’
// }

// Correspondence: {
//   correspondenceId: 1,
//   clinician: {
//     id: 13
//     firstName: ‘’,
//     lastName: ‘’,
//     flagged: true
//   },
//   client: {
//     id: 109,
//     firstName: ‘’,
//     lastName: ‘’,
//     flagged: false,
//     currentLevelOfCare: ‘IOP’
//   },
//   messages: [array of Message objects]
// }

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = {
  //When a message is sent, the MessageLog component should scroll to the bottom to show the new message
  scrollToBottom: function scrollToBottom() {
    var node = this.log;
    node.parentNode.scrollTop = node.scrollHeight;
  },

  //Convert user-entered string to a message object:
  addMessageProps: function addMessageProps(enteredText) {
    var fullMessage = {
      sender: "clinician",
      timeSent: new Date().toISOString(),
      content: enteredText,
      seen: true,
      flagged: false
    };
    return fullMessage;
  },

  //handles paragraph formatting for displayed messages
  formatMessage: function formatMessage(message) {
    var paragraphArray = message.split('\n');
    var formattedMessage = [];
    paragraphArray.forEach(function (paragraph, index) {
      formattedMessage.push(_react2.default.createElement(
        'p',
        { className: 'message-paragraph', key: index },
        paragraph
      ));
    });
    return formattedMessage;
  },

  myFetch: function myFetch(url, method, successCallback, failureCallback) {
    //Create headers with authorization token stored in cookie:
    var userCookie = document.cookie.slice(document.cookie.indexOf('user=') + 5);
    var accessToken = JSON.parse(decodeURIComponent(userCookie)).token;

    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + accessToken);

    var myInit = {
      method: method,
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };

    (0, _isomorphicFetch2.default)(url, myInit).then(function (response) {
      return response.json();
    }).then(function (response) {
      return successCallback(response);
    }).catch(function (response) {
      return failureCallback(response);
    });
  },

  sortByLastName: function sortByLastName(a, b) {
    if (a.lastName < b.lastName) {
      return -1;
    } else if (a.lastName > b.lastName) {
      return 1;
    } else {
      return 0;
    }
  }
};
exports.default = api;

},{"isomorphic-fetch":1,"react":"react"}],26:[function(require,module,exports){
// React component hierarchy: (*: Container Component)
// *ActiveConversationContainer
//   ActiveConversation
//     ConversationHeading
//     MessageLog
//       [MessageRow]
//         MessageContentBox
//     NewMessageInput
//       EnterToSend
// *ConversationSelectorContainer
//   ConversationSelector
//     CorrespondentList
//       [CorrespondentRow]
//     NewCorrespondentButton
//     *NewCorrespondentContainer
//       NewCorrespondentModal
//         ClientTable
//           [ClientRow]
//         [AddCorrespondentButton] 

'use strict';

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = require('redux');

var Redux = _interopRequireWildcard(_redux);

var _reducers = require('./reducers.jsx');

var _reducers2 = _interopRequireDefault(_reducers);

var _rootComponent = require('./components/root-component.jsx');

var _rootComponent2 = _interopRequireDefault(_rootComponent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'babel-polyfill';

var reduxStore = Redux.createStore(_reducers2.default.messagingApp, Redux.applyMiddleware(_reduxThunk2.default));
reduxStore.subscribe(render);
render();

function render() {
  _reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: reduxStore },
    _react2.default.createElement(_rootComponent2.default, {
      reduxState: reduxStore.getState()
    })
  ), document.getElementById('messaging-root'));
}

},{"./components/root-component.jsx":15,"./reducers.jsx":27,"react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","redux-thunk":3}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Redux = require('redux');
var ReduxThunk = require('redux-thunk').default;

var fudge = require('./fudge.js');
var Helper = require('./helper.jsx');

//re-indexes an array by the id property of its member objects
var lookup = function lookup(arr) {
  var lookupObject = {};
  arr.forEach(function (obj, index) {
    lookupObject[arr[index].id] = obj;
  });
  return lookupObject;
};

//list of all clients, which can be used to add a new correspondent
var clientList = function clientList() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {
    list: [],
    isFetching: false
  } : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'REQUEST_CLIENT_LIST_WAITING':
      return _extends({}, state, { isFetching: true });
    case 'REQUEST_CLIENT_LIST_FAILURE':
      console.log('failure!');
      return _extends({}, state, { isFetching: false });
    case 'RECEIVE_CLIENT_LIST':
      return { list: action.list.concat().sort(Helper.sortByLastName), isFetching: false };
    default:
      return state;
  }
};

var listOfCorrespondences = function listOfCorrespondences() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? fudge : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_NEW_CORRESPONDENCE':
      console.log(action);
      return state;
    default:
      return state;
  }
};

var messages = function messages() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? fudge[0].messages : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'SELECT_CORRESPONDENCE':
      return lookup(fudge)[action.id].messages;
    case 'SEND_MESSAGE':
      return state.concat([action.newMessage]);
    default:
      return state;
  }
};

var correspondent = function correspondent() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? fudge[0].client : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'SELECT_CORRESPONDENCE':
      return lookup(fudge)[action.id].client;
    default:
      return state;
  }
};

var correspondenceId = function correspondenceId() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? fudge[0].id : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'SELECT_CORRESPONDENCE':
      return action.id;
    default:
      return state;
  }
};

var enterToSendStatus = function enterToSendStatus() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'CHECKBOX_UPDATE':
      return action.checkboxValue;
    default:
      return state;
  }
};

var enteredText = function enteredText() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'TEXT_ENTRY':
      return action.enteredText;
    case 'SEND_MESSAGE':
      return '';
    default:
      return state;
  }
};

var selectedClientRow = function selectedClientRow() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'SELECT_CLIENT_ROW':
      return action.id;
    default:
      return state;
  }
};

var activeCorrespondence = Redux.combineReducers({
  correspondenceId: correspondenceId,
  correspondent: correspondent,
  messages: messages
});

var api = {
  messagingApp: Redux.combineReducers({
    listOfCorrespondences: listOfCorrespondences,
    clientList: clientList,
    selectedClientRow: selectedClientRow,
    activeCorrespondence: activeCorrespondence,
    enterToSendStatus: enterToSendStatus,
    enteredText: enteredText
  })
};

exports.default = api;

},{"./fudge.js":24,"./helper.jsx":25,"redux":"redux","redux-thunk":3}]},{},[26]);
