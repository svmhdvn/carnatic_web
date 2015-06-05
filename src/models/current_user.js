var CurrentUser = (function(){
  var localUserData = JSON.parse(localStorage.getItem('carnatic-currentUser')) || {};

  return {
    authToken: m.prop(localUserData.auth_token || ''),
    id: m.prop(localUserData.id || ''),
    email: m.prop(localUserData.email || '')
  }
}());

CurrentUser.reset = function(userData) {
  CurrentUser.authToken(userData.auth_token);
  CurrentUser.id(userData.id);
  CurrentUser.email(userData.email);
  localStorage.setItem('carnatic-currentUser', JSON.stringify(userData));
}

var AuthService = {
  login: function(email, password) {
    return m.request({
      method: 'POST',
      url: 'http://localhost:3000/users/login',
      data: {
        email: email,
        password: password
      }
    }).then(function(response) {
      CurrentUser.reset(response);
    });
  }
}