var React = require('react');

//Simply the checkbox; state and event handling managed by parent: NewMessageInput
module.exports = React.createClass({
  handleChange: function(e){
    this.props.onCheckboxChange(e);
  },
  render: function() {
    return (
      <div className="small pull-right">
        <div className="checkbox">
          <label>
            <input name="isEmergencyContact" type="checkbox" checked={this.props.isChecked} onChange={this.handleChange} />&nbsp;Press enter to send
          </label>
        </div>
      </div>
    );
  }
});