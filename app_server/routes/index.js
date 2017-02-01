var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlAccounts = require('../controllers/accounts');

// GET clinician view pages

router.get('/', ctrlMain.clientList);
router.get('/add-client', ctrlMain.addClientPage);

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
router.post('/edit-basic-info/:clientId', ctrlMain.editBasicInfo);
router.post('/add-contact/:clientId', ctrlMain.createContact);
router.post('/edit-contact/:clientId', ctrlMain.editContact);

//Handle login/registration of new clinicians
router.get('/login', ctrlAccounts.loginPage);
router.get('/add-clinician', ctrlAccounts.addClinicianPage);
router.post('/add-clinician', ctrlAccounts.createClinician);
router.post('/login', ctrlAccounts.signIn);

module.exports = router;
