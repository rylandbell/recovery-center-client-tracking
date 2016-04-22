/* GET list of patients */
module.exports.patientList = function(req, res, next) {
  res.render('patient-list', { title: 'List of Patients' });
};

/* GET new patient form */
module.exports.addPatient = function(req, res, next) {
  res.render('add-patient', { title: 'Add Patient' });
};

/* GET patient check-in */
module.exports.dashboard = function(req, res, next) {
  res.render('dashboard', { title: 'Patient Dashboard' });
};

/* GET patient check-in */
module.exports.clinicianSettings = function(req, res, next) {
  res.render('clinician-settings', { title: 'My Settings' });
};

/* GET patient check-in */
module.exports.editPatient = function(req, res, next) {
  res.render('edit-patient', { title: 'Edit Patient: Travis Outlaw' });
};