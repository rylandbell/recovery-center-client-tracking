var React = require('react');

//Simply the checkbox; state and event handling managed by parent: NewMessageInput
module.exports = ({enterToSendStatus, handleCheckboxChange}) => (
  <div className="small pull-right">
    <div className="checkbox">
      <label>
        <input name="isEmergencyContact" type="checkbox" checked={enterToSendStatus} onChange={handleCheckboxChange} />&nbsp;Press enter to send
      </label>
    </div>
  </div>
);