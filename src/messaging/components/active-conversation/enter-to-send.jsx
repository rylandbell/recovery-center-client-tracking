'use strict';

import React from 'react';

//Simply the checkbox; state and event handling managed by parent: NewMessageInput
const api = ({enterToSendStatus, handleCheckboxChange}) => (
  <div className="small pull-right">
    <div className="checkbox">
      <label>
        <input name="isEmergencyContact" type="checkbox" checked={enterToSendStatus} onChange={handleCheckboxChange} />&nbsp;Press enter to send
      </label>
    </div>
  </div>
);

export default api;