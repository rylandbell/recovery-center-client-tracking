var React = require('react');

module.exports = () => (
  <div tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" id="new-conversation-modal" className="modal fade">
    <div role="document" className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">(sortable/searchable list of <i>all&nbsp;</i>clients, which a clinician can use to initiate a new conversation.)</div>
      </div>
    </div>
  </div>
);