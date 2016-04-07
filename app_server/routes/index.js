var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */
// router.get('/', ctrlMain.index);

// GET clinician view pages
router.get('/', ctrlMain.patientList);
router.get('/my-patients', ctrlMain.patientList);
router.get('/add-patient', ctrlMain.addPatient);
router.get('/check-in', ctrlMain.checkIn);

module.exports = router;
