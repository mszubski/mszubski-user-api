const express = require('express');

const userActions = require('../controllers/user-actions');
const userCarsActions = require('../controllers/user-cars-actions');
const userDataActions = require('../controllers/user-data-actions');

const router = express.Router();

//userActions

router.post('/register', userActions.registerUser);

router.get('/login', userActions.logInUser);

router.get('/ping', userActions.getPing);

router.post('/getAuthToken', userActions.getAuthToken);

//userCarsActions

router.get('/getVehicleData', userCarsActions.getVehicleData);

router.post('/getVehicleDataWithToken', userCarsActions.getVehicleDataWithToken);

router.post('/getAllVehicleDataByUser', userCarsActions.getAllVehicleDataByUser);

router.post('/insertVehicleData', userCarsActions.insertVehicleData);

router.post('/insertVehicleDataFromApi', userCarsActions.insertVehicleDataFromApi);

router.post('/deleteAllVehicleDataFromUser', userCarsActions.deleteAllVehicleDataFromUser);

//userDataActions

router.get('/getUserData', userDataActions.getUserData);

router.post('/getUserDataWithToken', userDataActions.getUserDataWithToken);

router.post('/getAllUserDataByUser', userDataActions.getAllUserDataByUser);

router.post('/insertUserData', userDataActions.insertUserData);

router.post('/insertUserDataFromApi', userDataActions.insertUserDataFromApi);

router.post('/deleteAllUserDataFromUser', userDataActions.deleteAllUserDataFromUser);

module.exports = router;