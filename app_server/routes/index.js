var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

// GET clinician view pages
router.get('/login', ctrlMain.loginPage);
router.get('/', ctrlMain.clientList);
router.get('/add-client', ctrlMain.addClientPage);
router.get('/add-clinician', ctrlMain.addClinicianPage);
router.get('/my-settings', ctrlMain.clinicianSettings);
router.get('/calendar', ctrlMain.calendar);
router.get('/messaging', ctrlMain.messaging);

//GET single-client views
router.get('/check-in-history/:clientId', ctrlMain.checkinHistory);
router.get('/client-details/:clientId', ctrlMain.clientDetails);
router.get('/client-notes/:clientId', ctrlMain.clientNotes);

//POST create new client
router.post('/add-client', ctrlMain.createClient);

//POST edit client details
router.post('/add-contact/:clientId', ctrlMain.createContact);
router.post('/edit-contact/:clientId', ctrlMain.editContact);

//POST create new clinician
router.post('/add-clinician', ctrlMain.createClinician);

//POST send login credentials from login view
router.post('/login', ctrlMain.signIn);

module.exports = router;
