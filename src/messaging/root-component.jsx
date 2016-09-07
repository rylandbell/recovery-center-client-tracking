'use strict';

import React from 'react';

import ConversationSelectorContainer from './containers/conversation-selector-container.jsx';
import ActiveConversationContainer from './containers/active-conversation-container.jsx';

const api = ({reduxState}) => (
  <div className='row'>
    <div className='col-xs-12 col-sm-5 col-lg-3'>
      <ConversationSelectorContainer />
    </div>
    <div className='col-xs-12 col-sm-7 col-lg-8 col-lg-offset-1'>
      <ActiveConversationContainer reduxState={reduxState}/>
    </div>
  </div>
);

export default api;