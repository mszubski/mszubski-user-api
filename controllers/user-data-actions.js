const axios = require("axios");
const { createAndThrowError, createError } = require("../helpers/error");
const { getAuthToken, logInUserAuth } = require("./user-actions");
const UserData = require("../models/user-data");

const getUserData = async (request, response) => {
  let config = { "X-Auth-Token": process.env.API_KEY };
  let userData;
  try {
    userData = await axios.get(
      `http://${process.env.MSZUBSKI_API_WS_ADDRESS}/api/data/getUserData`,
      { headers: config }
    );
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || "Failed to get User Data.", code);
  }
  response.send(userData.data);
  return userData.data;
};

const getUserDataWithToken = async (request, response) => {
  let token = await getAuthToken(request, response);
  let config = { "X-Auth-Token": token };
  let userData;
  try {
    userData = await axios.get(
      `http://${process.env.MSZUBSKI_API_WS_ADDRESS}/api/data/getUserData`,
      { headers: config }
    );
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || "Failed to get User Data.", code);
  }
  response.send(userData.data);
  return userData.data;
};

const insertUserDataFromApi = async (request, response) => {
  let token = await getAuthToken(request, response);
  let config = { "X-Auth-Token": token };
  let userData;
  try {
    userData = await axios.get(
      `http://${process.env.MSZUBSKI_API_WS_ADDRESS}/api/data/getUserData`,
      { headers: config }
    );
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || "Failed to get User Data.", code);
  }

  const userDataDb = new UserData({
    username: request.body.username,
    firstName: userData.data.firstName,
    lastName: userData.data.lastName,
    jobTitle: userData.data.jobTitle,
    city: userData.data.city,
    streetName: userData.data.streetName,
    zipCode: userData.data.zipCode,
    state: userData.data.state,
    bankAccount:	userData.data.bankAccount,
    financeAmount:	userData.data.financeAmount,
    currencyName: userData.data.currencyName,
    phoneNumber: userData.data.phoneNumber,
    email: userData.data.email,
    favoriteMusic: userData.data.favoriteMusic
  });

  let savedUserData;

  try {
    savedUserData = await userDataDb.save();
  } catch (err) {
    const error = createError(err.message || "Failed to save user data!", 500);
    return next(error);
  }

  return response.send({message: `Saved data from user ${userDataDb.username} to MongoDb.`, userDataDb});
};

const deleteAllUserDataFromUser = async (request, response) => {
  let user;
  user = await logInUserAuth(request, response);

  if (user.username) {
    try {
      await UserData.deleteMany({username: user.username});
    } catch (err) {
      createAndThrowError(err.message || "Failed to delete user data!", 500);    
    }
  }  
  return response.send({message: `User Data from user ${user.username} was deleted in MongoDb.`});
};

const getAllUserDataByUser = async (request, response) => {
  let userDataDb;
  let user;
  user = await logInUserAuth(request, response);
  
  if (user.username) {
    try {
      userDataDb = await UserData.find({username: user.username});
    } catch (err) {
      createAndThrowError(err.message || "Failed to get user data!", 500);    
    }
  }  
  return response.send(userDataDb);
};

const insertUserData = async (request, response) => {
  let user;
  user = await logInUserAuth(request, response);

  if(user.username){

    const userDataDb = new UserData({
      username: request.body.username,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      jobTitle: request.body.jobTitle,
      city: request.body.city,
      streetName: request.body.streetName,
      zipCode: request.body.zipCode,
      state: request.body.state,
      bankAccount:	request.body.bankAccount,
      financeAmount:	request.body.financeAmount,
      currencyName: request.body.currencyName,
      phoneNumber: request.body.phoneNumber,
      email: request.body.email,
      favoriteMusic: request.body.favoriteMusic
    });

  try {
    await userDataDb.save();
  } catch (err) {
    response.status(401).json({ message: `Failed to insert user data!` });
  }

  return response.send({message: `Saved user data inserted from user ${userDataDb.username} to MongoDb.`, userDataDb});
  }
};

exports.getUserData = getUserData;
exports.getUserDataWithToken = getUserDataWithToken;
exports.getAllUserDataByUser = getAllUserDataByUser;
exports.insertUserDataFromApi = insertUserDataFromApi;
exports.insertUserData = insertUserData;
exports.deleteAllUserDataFromUser = deleteAllUserDataFromUser;