'use strict';

import React from 'react';

import Helper from '../helper.jsx';
import MessageRow from './message-row.jsx';

//creates array of MessageRows
const api = React.createClass({
  componentDidUpdate: Helper.scrollToBottom,
  componentDidMount: Helper.scrollToBottom,
  render: function() {
    return (
      <div className="messages-display" ref={(c) => this.log = c}>
        {this.props.activeCorrespondence.messages.map((message,index) => <MessageRow message={message} correspondent={this.props.activeCorrespondence.correspondent} key={index}/>)}
      </div> 
    );
  }
});

export default api;