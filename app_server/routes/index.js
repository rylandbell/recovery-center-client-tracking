var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

// GET clinician view pages
router.get('/', ctrlMain.patientList);
router.get('/add-patient', ctrlMain.addPatient);
router.get('/check-in-history', ctrlMain.checkinHistory);
router.get('/my-settings', ctrlMain.clinicianSettings);
router.get('/edit-patient', ctrlMain.editPatient);
router.get('/patient-info', ctrlMain.patientInfo);

module.exports = router;
