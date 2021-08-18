const bcrypt = require("bcryptjs");
const axios = require("axios");
const { createAndThrowError, createError } = require("../helpers/error");
const User = require("../models/user");

const getPing = async (request, response) => {
  let data;
  try {
    data = await axios.get(
      `http://${process.env.MSZUBSKI_API_WS_ADDRESS}/api/ping`
    );
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || "Failed to ping the app!", code);
  }
  response.status(200).json({ message: `Application is running!` });
};

const getAuthToken = async (request, response) => {
  let user;
  user = await logInUserAuth(request, response);
  let authToken;
  let params = {
    username: user.username,
    password: user.password
  };
  if (user.username) {
    try {
      authToken = await axios.post(
        `http://${process.env.MSZUBSKI_API_WS_ADDRESS}/api/auth`, params
      );
    } catch (err) {
      const code = (err.response && err.response.status) || 500;
      createAndThrowError(err.message || "Failed to get a token!", code);
    }
    return authToken.data.token;
  } else {
    response
      .status(401)
      .json(`The user is not authorized to get the auth token!`);
  }
};

const registerUser = async (request, response, next) => {
  let username = request.body.username;
  let password = request.body.password;

  try {
    validateUserData(username, password);
  } catch (err) {
    return next(err);
  }

  try {
    await checkIfUserExist(username);
  } catch (err) {
    return next(err);
  }

  let bcryptPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username: username,
    password: bcryptPassword,
  });

  let savedUser;

  try {
    savedUser = await newUser.save();
  } catch (err) {
    const error = createError(err.message || "Failed to create user!", 500);
    return next(error);
  }

  response
    .status(201)
    .json({
      message: `The user ${username} has been created!`,
      user: savedUser.toObject(),
    });
};

const checkIfUserExist = async (username) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    createAndThrowError("Failed to create user!", 500);
  }

  if (existingUser) {
    createAndThrowError("Failed to create user!", 422);
  }
};

const validateUserData = (username, password) => {
  if (
    !username ||
    username.trim().length === 0 ||
    !password ||
    password.trim().length < 7
  ) {
    createAndThrowError("Wrong username or password!", 422);
  }
};

const logInUser = async (request, response) => {
  let username = request.body.username;
  let password = request.body.password;

  try {
    let user = await User.findOne({ username: username }).exec();
    if (!user) {
      return response
        .status(400)
        .send({ message: "The username does not exist!" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return response.status(400).send({ message: "The password is invalid" });
    }
    response.send({
      message: "The username and password combination is correct!",
    });
    return user;
  } catch (error) {
    response.status(500).send(error);
  }
};

const logInUserAuth = async (request, response) => {
  let username = request.body.username;
  let password = request.body.password;

  try {
    let user = await User.findOne({ username: username }).exec();
    if (!user) {
      return response
        .status(400)
        .send({ message: "The username does not exist!" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return response.status(400).send({ message: "The password is invalid" });
    }
    return user;
  } catch (error) {
    response.status(500).send(error);
  }
};

exports.registerUser = registerUser;
exports.logInUser = logInUser;
exports.logInUserAuth = logInUserAuth;
exports.getPing = getPing;
exports.getAuthToken = getAuthToken;