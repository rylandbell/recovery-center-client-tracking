var React = require('react');

var NewCorrespondentButton = require('./new-correspondent-button.jsx');
var NewCorrespondentModal = require('./new-correspondent-modal.jsx');
var CorrespondentList = require('./correspondent-list.jsx');

module.exports = () => (
  <div>
    <div className="conversation-list">
      <h4 className="text-center">My Correspondents</h4>
      <hr/>
      <CorrespondentList />
      <hr/>
      <NewCorrespondentButton />
    </div>
    <NewCorrespondentModal />
  </div>
);

