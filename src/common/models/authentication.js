var CurrentUser = (function(){
  var localUserData = JSON.parse(localStorage.getItem('carnatic-currentUser')) || {};

  return {
    uid: m.prop(localUserData.uid || ''),
    email: m.prop(localUserData.email || '')
  };
}());

CurrentUser.reset = function(userData) {
  CurrentUser.uid(userData.uid);
  CurrentUser.email(userData.email);
  localStorage.setItem('carnatic-currentUser', JSON.stringify(userData));
};

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
}