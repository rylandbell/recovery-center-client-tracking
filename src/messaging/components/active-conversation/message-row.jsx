'use strict';

import React from 'react';

import MessageContentBox from './message-content-box.jsx';

//assembles message display from date,  sender, content
const api = ({message, correspondent}) => (
  <div>
    <div className={'message '+(message.sender==='clinician' ? 'from-user' : 'to-user')}>
      <div className="message-header">
        <div className="message-author">{message.sender==='clinician' ? 'Me' : correspondent.firstName}</div>
        <div className="clearfix"></div>
      </div>
      <MessageContentBox content={message.content} />
      <div className="clearfix"></div>
      <div className="message-time small">{moment(message.timeSent).format('MMM D, YYYY. h:mm A')}</div>
    </div>
    <div className="clearfix">
    </div>
  </div>
);

export default api;