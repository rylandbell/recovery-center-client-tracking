/* GET list of patients */
module.exports.patientList = function(req, res, next) {
  res.render('patient-list', { title: 'List of Patients' });
};

/* GET new patient form */
module.exports.addPatient = function(req, res, next) {
  res.render('add-patient', { title: 'Add Patient' });
};

/* GET patient check-in */
module.exports.checkIn = function(req, res, next) {
  res.render('check-in', { title: 'Patient Check-In' });
};