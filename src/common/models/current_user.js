var API = require('../services/api_service.js');
var Korvai = require('../models/korvai.js');
var Profile = require('../models/profile.js');

var CurrentUser = (function(){
  var localUserData = JSON.parse(localStorage.getItem('carnatic-currentUser')) || {};

  return {
    id: m.prop(localUserData.id || ''),
    email: m.prop(localUserData.email || ''),
    auth_token: m.prop(localUserData.auth_token || ''),

    // cached current user relationships
    _profile: m.prop(false)
  };
}());

CurrentUser.setUser = function(userData) {
  CurrentUser.id(userData.id);
  CurrentUser.email(userData.email);
  CurrentUser.auth_token(userData.auth_token);
  localStorage.setItem('carnatic-currentUser', JSON.stringify(userData));
};

CurrentUser.clear = function() {
  localStorage.removeItem('carnatic-currentUser');
  CurrentUser.id('');
  CurrentUser.email('');
  CurrentUser.auth_token('');
  CurrentUser._profile(false);
};

CurrentUser.profile = function() {
  if(CurrentUser._profile()) return CurrentUser._profile;
  else return API('GET', '/users/' + CurrentUser.id() + '/profile').then(function(profile) {
    var p = new Profile(profile);
    CurrentUser._profile(p);
    return p;
  });
};

CurrentUser.korvais = function() {
  return API('GET', '/users/' + CurrentUser.id() + '/korvais').then(function(korvais) {
    return korvais.map(function(k, index) {return new Korvai(k)});
  });
};

CurrentUser.followers = function() {
  return API('GET', '/users/' + CurrentUser.id() + '/followers').then(function(followers) {
    return followers.map(function(f, index) {return new Profile(f)});
  });
};

CurrentUser.followings = function() {
  return API('GET', '/users/' + CurrentUser.id() + '/followings').then(function(followings) {
    return followings.map(function(f, index) {return new Profile(f)});
  });
};

module.exports = CurrentUser;