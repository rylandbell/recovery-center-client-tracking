/* GET list of clients */
module.exports.clientList = function (req, res, next) {
  res.render('client-list', { title: 'Wasatch: List of Clients' });
};

/* GET new client form */
module.exports.addClient = function (req, res, next) {
  res.render('add-client', { title: 'Wasatch: Add Client' });
};

/* GET client check-in history */
module.exports.checkinHistory = function (req, res, next) {
  res.render('check-in-history', { title: 'Wasatch: Check-in History' });
};

/* GET update clinician's settings */
module.exports.clinicianSettings = function (req, res, next) {
  res.render('clinician-settings', { title: 'Wasatch: My Settings' });
};

/* GET edit client form */
module.exports.editClient = function (req, res, next) {
  res.render('edit-client', { title: 'Wasatch: Edit Client' });
};

/* GET client info home */
module.exports.clientInfo = function (req, res, next) {
  res.render('client-info', { title: 'Wasatch: Client Info' });
};

/* GET client notes page */
module.exports.clientNotes = function (req, res, next) {
  res.render('client-notes', { title: 'Wasatch: Client Info' });
};

module.exports.calendar = function (req, res, next) {
  res.render('calendar', { title: 'Wasatch: Calendar' });
};
