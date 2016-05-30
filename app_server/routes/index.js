var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

// GET clinician view pages
router.get('/', ctrlMain.clientList);
router.get('/add-client', ctrlMain.addClient);
router.get('/check-in-history', ctrlMain.checkinHistory);
router.get('/my-settings', ctrlMain.clinicianSettings);
router.get('/edit-client', ctrlMain.editClient);
router.get('/client-info', ctrlMain.clientInfo);
router.get('/client-notes', ctrlMain.clientNotes);
router.get('/calendar', ctrlMain.calendar);


module.exports = router;
