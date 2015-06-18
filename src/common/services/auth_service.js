var CurrentUser = require('../models/current_user.js');
var APIUrl = 'http://localhost:3000';

var AuthService = {
  register: function(name, email, password) {
    m.startComputation();

    return m.request({method: 'POST', url: APIUrl + '/users', data: {
      name: name,
      email: email,
      password: password,
      password_confirmation: password
    }}).then(function(userData) {
      console.log("registration success: ", userData);
      CurrentUser.setUser(userData);
      m.endComputation();
    }, function(error) {
      console.log("registration failure: ", error);
      m.endComputation();
    });
  },

  login: function(email, password) {
    m.startComputation();

    return m.request({method: 'POST', url: APIUrl + '/users/login', data: {
      email: email,
      password: password
    }}).then(function(userData) {
      console.log("login success: ", userData);
      CurrentUser.setUser(userData);
      m.endComputation();
    }, function(error) {
      console.log("login failure: ", error);
      m.endComputation();
    });
  },

  logout: function() {
    CurrentUser.clear();
  }
};

module.exports = AuthService;