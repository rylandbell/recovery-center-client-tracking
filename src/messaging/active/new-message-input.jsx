'use strict';

import React from 'react';

import EnterToSend from './enter-to-send.jsx';

//owns new message, enterToSend states; handles all form events
const api = ({handleSubmit,enteredText,handleTextChange,listenForEnter,enterToSendStatus,handleCheckboxChange}) => (
  <form className="new-message-form" onSubmit={handleSubmit}>
    <textarea placeholder="Your Message" className="form-control" rows='6' value={enteredText} onChange={handleTextChange} onKeyPress={listenForEnter}/>
    <input className='btn btn-primary' type='submit' value='Send' />
    <EnterToSend enterToSendStatus={enterToSendStatus} handleCheckboxChange={handleCheckboxChange} />
    <div className="clearfix"></div>
  </form>
);

export default api;