var CurrentUser = require('../models/current_user.js');

var AuthService = {
  login: function(email, password) {
    m.startComputation();

    return m.request({method: 'POST', url: 'http://localhost:3000/users/login', data: {
      email: email,
      password: password
    }}).then(function(userData) {
      console.log("login success: ", userData);
      CurrentUser.reset(userData);
      m.endComputation();
    }, function(error) {
      console.log("login failure: ", error);
      m.endComputation();
    });
  }
};

module.exports = AuthService;