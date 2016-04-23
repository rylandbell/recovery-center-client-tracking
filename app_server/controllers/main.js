/* GET list of patients */
module.exports.patientList = function(req, res, next) {
  res.render('patient-list', { title: 'Wasatch: List of Patients' });
};

/* GET new patient form */
module.exports.addPatient = function(req, res, next) {
  res.render('add-patient', { title: 'Wasatch: Add Patient' });
};

/* GET patient check-in history */
module.exports.checkinHistory = function(req, res, next) {
  res.render('check-in-history', { title: 'Wasatch: Check-in History' });
};

/* GET update clinician's settings */
module.exports.clinicianSettings = function(req, res, next) {
  res.render('clinician-settings', { title: 'Wasatch: My Settings' });
};

/* GET edit patient form */
module.exports.editPatient = function(req, res, next) {
  res.render('edit-patient', { title: 'Wasatch: Edit Patient' });
};

/* GET edit patient form */
module.exports.patientInfo = function(req, res, next) {
  res.render('patient-info', { title: 'Wasatch: Patient Info' });
};