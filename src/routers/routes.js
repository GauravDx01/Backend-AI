const express = require('express');
// const fileController = require('../controllers/fileCOntroller');
const questionController = require('../controllers/questionController');
const {getParagraphs, getStoredData} = require('../controllers/fetchData')
const scrapeController = require('../controllers/scrapeController');
const {register , login} = require('../controllers/authController')
const {createRole , getRoles , getRouteForEdit , editRole , delRoles} = require('../controllers/roleController')
const router = express.Router();

// router.get('/content', fileController.getFileContent);

router.post('/askQuestion', questionController.askQuestion);
router.post('/fetchData', getParagraphs)
router.get('/getStoredData', getStoredData)
router.get('/scrape', scrapeController.getLinks);
router.post('/register' ,register )
router.post('/login' , login )
router.post('/create-role' , createRole )
router.get('/get-roles' , getRoles )
router.get('/edit-role/:id' , getRouteForEdit )
router.put('/edit-role/:id' , editRole)
router.delete('/delete-role/:id' , delRoles)

module.exports = router;
