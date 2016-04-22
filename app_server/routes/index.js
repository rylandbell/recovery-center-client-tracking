var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

// GET clinician view pages
router.get('/', ctrlMain.patientList);
router.get('/add-patient', ctrlMain.addPatient);
router.get('/dashboard', ctrlMain.dashboard);
router.get('/my-settings', ctrlMain.clinicianSettings);
router.get('/edit-patient', ctrlMain.editPatient);

module.exports = router;
