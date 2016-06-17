var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

// GET clinician view pages
router.get('/', ctrlMain.clientList);
router.get('/add-client', ctrlMain.addClient);
router.get('/my-settings', ctrlMain.clinicianSettings);
router.get('/calendar', ctrlMain.calendar);

//GET single-client views
router.get('/check-in-history/:clientId', ctrlMain.checkinHistory);
router.get('/client-details/:clientId', ctrlMain.clientDetails);
router.get('/client-notes/:clientId', ctrlMain.clientNotes);

module.exports = router;
