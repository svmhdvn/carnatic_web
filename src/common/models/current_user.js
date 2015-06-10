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

module.exports = CurrentUser;