var React = require('react');

var EnterToSend = require('./enter-to-send.jsx');

//owns new message, enterToSend states; handles all form events
module.exports = ({handleSubmit,enteredText,handleTextChange,listenForEnter,enterToSendStatus,handleCheckboxChange}) => (
  <form className="new-message-form" onSubmit={handleSubmit}>
    <textarea placeholder="Your Message" className="form-control" rows='6' value={enteredText} onChange={handleTextChange} onKeyPress={listenForEnter}/>
    <input className='btn btn-primary' type='submit' value='Send' />
    <button className='btn btn-default' type='button' data-dismiss='modal'> Close Without Saving </button>
    <EnterToSend enterToSendStatus={enterToSendStatus} handleCheckboxChange={handleCheckboxChange} />
    <div className="clearfix"></div>
  </form>
);