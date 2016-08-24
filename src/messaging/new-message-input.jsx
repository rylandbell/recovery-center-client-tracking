var React = require('react');
var Helper = require('./helper.jsx');
var EnterToSend = require('./enter-to-send.jsx');

//owns new message, enterToSend states; handles all form events
module.exports = React.createClass({
  getInitialState: function() {
    return {
      enterToSendStatus: true
    };
  },

  handleCheckboxChange: function(e) {
    this.setState({enterToSendStatus: e.target.checked});
  },

  sendWithEnter: function(e){
    if(e.charCode===13 && this.state.enterToSendStatus){
      e.preventDefault();
      $('.new-message-form input[type="submit"]').click();
    }
  },
  render: function(){
    return (
      <form className="new-message-form" onSubmit={this.props.handleSubmit}>
        <textarea placeholder="Your Message" className="form-control" rows='6' value={this.props.msgContent} onChange={this.props.handleTextChange} onKeyPress={this.sendWithEnter}/>
        <input className='btn btn-primary' type='submit' value='Send' />
        <EnterToSend enterToSendStatus={this.state.enterToSendStatus} handleCheckboxChange={this.handleCheckboxChange} />
        <div className="clearfix"></div>
      </form>
    );
  }
});