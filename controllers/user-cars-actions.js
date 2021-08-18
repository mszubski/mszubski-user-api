const axios = require("axios");
const { createAndThrowError, createError } = require("../helpers/error");
const { getAuthToken, logInUserAuth } = require("./user-actions");
const VehicleData = require("../models/user-cars");

const getAllVehicleDataByUser = async (request, response) => {
  let vehicleDataDb;
  let user;
  user = await logInUserAuth(request, response);
  
  if (user.username) {
    try {
      vehicleDataDb = await VehicleData.find({username: user.username});
    } catch (err) {
      createAndThrowError(err.message || "Failed to get user data!", 500);    
    }
  }  
  return response.send(vehicleDataDb);
};

const deleteAllVehicleDataFromUser = async (request, response) => {
  let user;
  user = await logInUserAuth(request, response);

  if (user.username) {
    try {
      await VehicleData.deleteMany({username: user.username});
    } catch (err) {
      createAndThrowError(err.message || "Failed to delete user data!", 500);    
    }
  }  
  return response.send({message: `Vehicle Data from user ${user.username} was deleted in MongoDb.`});
};

const insertVehicleData = async (request, response) => {
  let user;
  user = await logInUserAuth(request, response);

  if(user.username){

  const vehicleDataDb = new VehicleData({
    username: request.body.username,
    vehicle: request.body.vehicle,
    manufacturer: request.body.manufacturer,
    model: request.body.model,
    type: request.body.type,
    fuel: request.body.fuel,
    vin: request.body.vin,
    color: request.body.color
  });

  try {
    await vehicleDataDb.save();
  } catch (err) {
    response.status(401).json({ message: `Failed to insert vehicle data!` });
  }

  return response.send({message: `Saved vehicle data inserted from user ${vehicleDataDb.username} to MongoDb.`, vehicleDataDb});
  }
};

const insertVehicleDataFromApi = async (request, response) => {
  let token = await getAuthToken(request, response);
  let config = { "X-Auth-Token": token };
  let vehicleData;
  try {
    vehicleData = await axios.get(
      `http://${process.env.MSZUBSKI_API_WS_ADDRESS}/api/data/getVehicleData`,
      { headers: config }
    );
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || "Failed to get Vehicle Data.", code);
  }

  const vehicleDataDb = new VehicleData({
    username: request.body.username,
    vehicle: vehicleData.data.vehicle,
    manufacturer: vehicleData.data.manufacturer,
    model: vehicleData.data.model,
    type: vehicleData.data.type,
    fuel: vehicleData.data.fuel,
    vin: vehicleData.data.vin,
    color: vehicleData.data.color
  });

  let savedVehicleData;

  try {
    savedVehicleData = await vehicleDataDb.save();
  } catch (err) {
    const error = createError(err.message || "Failed to save vehicle data!", 500);
    return next(error);
  }

  return response.send({message: `Saved vehicle data from user ${vehicleDataDb.username} to MongoDb.`, vehicleDataDb});
};

const getVehicleDataWithToken = async (request, response) => {
  let token = await getAuthToken(request, response);
  let config = { "X-Auth-Token": token };
  let vehicleData;
  try {
    vehicleData = await axios.get(
      `http://${process.env.MSZUBSKI_API_WS_ADDRESS}/api/data/getVehicleData`,
      { headers: config }
    );
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || "Failed to get User Data.", code);
  }
  response.send(vehicleData.data);
  return vehicleData.data;
};

const getVehicleData = async (request, response) => {
  let config = { "X-Auth-Token": process.env.API_KEY };
  let vehicleData;
  try {
    vehicleData = await axios.get(
      `http://${process.env.MSZUBSKI_API_WS_ADDRESS}/api/data/getVehicleData`,
      { headers: config }
    );
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || "Failed to get User Data.", code);
  }
  response.send(vehicleData.data);
  return vehicleData.data;
};

exports.getVehicleData = getVehicleData;
exports.getVehicleDataWithToken = getVehicleDataWithToken;
exports.insertVehicleDataFromApi = insertVehicleDataFromApi;
exports.deleteAllVehicleDataFromUser = deleteAllVehicleDataFromUser;
exports.insertVehicleData = insertVehicleData;
exports.getAllVehicleDataByUser = getAllVehicleDataByUser;