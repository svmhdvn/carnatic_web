var CurrentUser = require('../models/current_user.js');

var AuthService = {
  login: function(email, password) {
    var ref = new Firebase("https://carnatic.firebaseio.com/");
    var deferred = m.deferred();
    m.startComputation();

    ref.authWithPassword({
      email: email,
      password: password
    }, function(error, authData) {
      if(error) {
        console.log("Firebase login failed, error: ", error);
        deferred.reject(error);
        m.endComputation();
      } else {
        console.log("Firebase login successful, authData: ", authData);
        var userData = {
          uid: authData.uid,
          email: authData.password.email
        }
        CurrentUser.reset(userData);
        deferred.resolve(userData);
        m.endComputation();
      }
    });

    return deferred.promise;
  }
};

module.exports = AuthService;