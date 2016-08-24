var React = require('react');
var EnterToSend = require('./enter-to-send.jsx');

//owns new message, enterToSend states; handles all form events
module.exports = ({handleSubmit,msgContent,handleTextChange,sendWithEnterCheck,enterToSendStatus,handleCheckboxChange}) => (
  <form className="new-message-form" onSubmit={handleSubmit}>
    <textarea placeholder="Your Message" className="form-control" rows='6' value={msgContent} onChange={handleTextChange} onKeyPress={sendWithEnterCheck}/>
    <input className='btn btn-primary' type='submit' value='Send' />
    <EnterToSend enterToSendStatus={enterToSendStatus} handleCheckboxChange={handleCheckboxChange} />
    <div className="clearfix"></div>
  </form>
);