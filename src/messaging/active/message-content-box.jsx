var React = require('react');

var Helper = require('../helper.jsx');

//handles paragraph breaks in message text
module.exports = ({content}) => (
    <div className="message-content pull-right">{Helper.formatMessage(content)}</div>
);