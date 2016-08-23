var React = require('react');

var EnterToSend = require('./enter-to-send.jsx');

//owns new message, enterToSend states; handles all form events
module.exports = React.createClass({
  getInitialState: function() {
    return {
      msgContent: '',
      enterToSend: true
    };
  },
  handleTextChange: function(e) {

    //typing only directly changes state, which in turn updates text in textarea field:
    e.preventDefault();
    this.setState({msgContent: e.target.value});
  },
  handleCheckboxChange: function(e) {
    this.setState({enterToSend: e.target.checked});
  },
  handleSubmit: function(e){
    e.preventDefault();
    console.log(this.state.msgContent);
    if(!this.state.msgContent){
      return;
    } else {

      //add a timestamp (etc.) and send the state to the parent Conversation component for processing:
      this.props.onMessageSubmit(
        Helper.addMessageProps(this.state.msgContent)
      );

      //reset state, which in turn resets the form:
      this.setState({msgContent: ''});
    };
  },
  sendWithEnter: function(e){
    if(e.charCode===13 && this.state.enterToSend){
      e.preventDefault();
      $('.new-message-form input[type="submit"]').click();
    }
  },
  render: function(){
    return (
      <form className="new-message-form" onSubmit={this.handleSubmit}>
        <textarea placeholder="Your Message" className="form-control" required rows='6' value={this.state.msgContent} onChange={this.handleTextChange} onKeyPress={this.sendWithEnter}/>
        <input className='btn btn-primary' type='submit' value='Send' />
        <EnterToSend isChecked={this.state.enterToSend} onCheckboxChange={this.handleCheckboxChange} />
        <div className="clearfix"></div>
      </form>
    );
  }
});