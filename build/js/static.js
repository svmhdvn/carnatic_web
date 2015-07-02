(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/siva/Documents/projects/carnatic_mithril/src/Static/login.js":[function(require,module,exports){
var AuthService = require('../common/services/auth_service.js');

var LoginPage = {};

LoginPage.controller = function() {
  var vm = this;

  vm.email = m.prop('');
  vm.password = m.prop('');
  vm.alerts = m.prop([]);

  vm.login = function(e) {
    e.preventDefault();
    
    if(vm.email() && vm.password()) {
      AuthService.login(vm.email(), vm.password()).then(function() {
        window.location.replace("/app");
      }, function() {
        vm.alerts().push("Login failure!");
      });
    } else {
      vm.alerts().push("Fields cannot be empty");
    }
  }
};

LoginPage.view = function(ctrl) {
  var alerts = ctrl.alerts().map(function(msg, index) {
    return (
      {tag: "div", attrs: {class:"alert alert-warning alert-dismissible", role:"alert"}, children: [
        {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"alert", "aria-label":"Close"}, children: [{tag: "span", attrs: {"aria-hidden":"true"}, children: ["×"]}]}, 
        msg
      ]}
    );
  });

  return (
    {tag: "div", attrs: {id:"Login"}, children: [
      {tag: "div", attrs: {class:"container"}, children: [
        {tag: "form", attrs: {class:"form-signin", onsubmit:ctrl.login}, children: [
          {tag: "h2", attrs: {class:"form-signin-heading"}, children: ["Please sign in"]}, 

          {tag: "label", attrs: {for:"inputEmail", class:"sr-only"}, children: ["Email address"]}, 
          {tag: "input", attrs: {
            type:"email", 
            id:"inputEmail", 
            class:"form-control", 
            placeholder:"Email address", 
            onchange:m.withAttr('value', ctrl.email), 
            value:ctrl.email(), 
            required:true,autofocus:true}}, 

          {tag: "label", attrs: {for:"inputPassword", class:"sr-only"}, children: ["Password"]}, 
          {tag: "input", attrs: {
            type:"password", 
            id:"inputPassword", 
            class:"form-control", 
            placeholder:"Password", 
            onchange:m.withAttr('value', ctrl.password), 
            value:ctrl.password(), 
            required:true}}, 

          {tag: "button", attrs: {class:"btn btn-lg btn-primary btn-block", type:"submit"}, children: ["Sign in"]}
        ]}, 

        alerts
      ]}
    ]}
  );
};

module.exports = LoginPage;
},{"../common/services/auth_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/auth_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/Static/register.js":[function(require,module,exports){
var AuthService = require('../common/services/auth_service.js');

var RegisterPage = {};

RegisterPage.controller = function() {
  var vm = this;

  vm.name = m.prop('');
  vm.email = m.prop('');
  vm.password = m.prop('');
  vm.password_confirmation = m.prop('');

  vm.alerts = m.prop([]);

  vm.register = function(e) {
    e.preventDefault();

    if(vm.name() && vm.email() && vm.password() && vm.password() == vm.password_confirmation()) {
      AuthService.register(vm.name(), vm.email(), vm.password()).then(function() {
        vm.alerts().push("Registration success!");
      }, function() {
        vm.alerts().push("Registration failure!");
      });
    } else {
      vm.alerts().push("Please recheck the fields, something went wrong");
    }
  }
};

RegisterPage.view = function(ctrl) {
  var alerts = ctrl.alerts().map(function(msg, index) {
    return (
      {tag: "div", attrs: {class:"alert alert-warning alert-dismissible", role:"alert"}, children: [
        {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"alert", "aria-label":"Close"}, children: [{tag: "span", attrs: {"aria-hidden":"true"}, children: ["×"]}]}, 
        msg
      ]}
    );
  });

  return (
    {tag: "div", attrs: {id:"Register"}, children: [
      {tag: "div", attrs: {class:"container"}, children: [
        {tag: "form", attrs: {class:"form-signin", onsubmit:ctrl.register}, children: [
          {tag: "h2", attrs: {class:"form-signin-heading"}, children: ["Register new account"]}, 

          {tag: "label", attrs: {for:"inputName", class:"sr-only"}, children: ["Name"]}, 
          {tag: "input", attrs: {
            id:"inputName", 
            class:"form-control", 
            placeholder:"Name", 
            onchange:m.withAttr('value', ctrl.name), 
            value:ctrl.name(), 
            required:true,autofocus:true}}, 

          {tag: "label", attrs: {for:"inputEmail", class:"sr-only"}, children: ["Email address"]}, 
          {tag: "input", attrs: {
            type:"email", 
            id:"inputEmail", 
            class:"form-control", 
            placeholder:"Email address", 
            onchange:m.withAttr('value', ctrl.email), 
            value:ctrl.email(), 
            required:true}}, 

          {tag: "label", attrs: {for:"inputPasswordRegister", class:"sr-only"}, children: ["Password"]}, 
          {tag: "input", attrs: {
            type:"password", 
            id:"inputPasswordRegister", 
            class:"form-control", 
            placeholder:"Password", 
            onchange:m.withAttr('value', ctrl.password), 
            value:ctrl.password(), 
            required:true}}, 

          {tag: "label", attrs: {for:"inputPasswordConfirm", class:"sr-only"}, children: ["Confirm Password"]}, 
          {tag: "input", attrs: {
            type:"password", 
            id:"inputPasswordConfirm", 
            class:"form-control", 
            placeholder:"Confirm Password", 
            onchange:m.withAttr('value', ctrl.password_confirmation), 
            value:ctrl.password_confirmation(), 
            required:true}}, 

          {tag: "button", attrs: {class:"btn btn-lg btn-primary btn-block", type:"submit"}, children: ["Sign in"]}
        ]}, 

        alerts
      ]}
    ]}
  );
};

module.exports = RegisterPage;
},{"../common/services/auth_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/auth_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js":[function(require,module,exports){
var API = require('../services/api_service.js');
var Korvai = require('../models/korvai.js');
var Profile = require('../models/profile.js');

var CurrentUser = (function(){
  var localUserData = JSON.parse(localStorage.getItem('carnatic-currentUser')) || {};

  return {
    id: m.prop(localUserData.id || ''),
    email: m.prop(localUserData.email || ''),
    auth_token: m.prop(localUserData.auth_token || '')
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
};

CurrentUser.profile = function() {
  return API('GET', '/users/' + CurrentUser.id() + '/profile').then(function(profile) {
    return new Profile(profile);
  });
};

CurrentUser.korvais = function() {
  return API('GET', '/users/' + CurrentUser.id() + '/korvais').then(function(korvais) {
    return korvais.map(function(k, index) {return new Korvai(k)});
  });
};

module.exports = CurrentUser;
},{"../models/korvai.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/korvai.js","../models/profile.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/profile.js","../services/api_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/api_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/common/models/korvai.js":[function(require,module,exports){
var Korvai = function(data) {
  this.id = m.prop(data.id || 0);
  this.user_id = m.prop(data.user_id || 0);
  this.content = m.prop(data.content || '');
  this.thalam = m.prop(data.thalam || 32);
  this.matras_after = m.prop(data.matrasAfter || 0);
  this.created_at = m.prop(data.created_at || '');
};

module.exports = Korvai;
},{}],"/home/siva/Documents/projects/carnatic_mithril/src/common/models/profile.js":[function(require,module,exports){
var API = require('../services/api_service.js');

var Profile = function(data) {
  var p = this;

  p.id = m.prop(data.id || 0);
  p.user_id = m.prop(data.user_id || 0);
  p.name = m.prop(data.name || '');

  p.picture_url = m.prop(data.picture_url || '');
  p.getSizedPicture = function(size) {
    return p.picture_url() + "&s=" + size;
  }
  
  p.created_at = m.prop(data.created_at || '');
};

module.exports = Profile;
},{"../services/api_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/api_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/common/services/api_service.js":[function(require,module,exports){
// requires method (e.g. GET, POST, etc.)
// requires url (e.g. '/users/1')
// optional data (javascript object)
// optional auth_token (if authentication is required)
var API = function(method, url, data, auth_token) {
  var xhrConfig = function(xhr) {
    if(auth_token) xhr.setRequestHeader('Authorization', 'Token ' + auth_token);
  };

  return m.request({
    method: method,
    url: 'http://localhost:3000' + url,
    data: data || {},
    config: xhrConfig
  });
};

module.exports = API;
},{}],"/home/siva/Documents/projects/carnatic_mithril/src/common/services/auth_service.js":[function(require,module,exports){
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
  }
};

module.exports = AuthService;
},{"../models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/static.js":[function(require,module,exports){
var LoginPage = require('./Static/login.js');
var RegisterPage = require('./Static/register.js');

m.route.mode = 'hash';
m.route(document.getElementById('StaticContainer'), '/login', {
  '/login': LoginPage,
  '/register': RegisterPage
});
},{"./Static/login.js":"/home/siva/Documents/projects/carnatic_mithril/src/Static/login.js","./Static/register.js":"/home/siva/Documents/projects/carnatic_mithril/src/Static/register.js"}]},{},["/home/siva/Documents/projects/carnatic_mithril/src/static.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvU3RhdGljL2xvZ2luLmpzIiwic3JjL1N0YXRpYy9yZWdpc3Rlci5qcyIsInNyYy9jb21tb24vbW9kZWxzL2N1cnJlbnRfdXNlci5qcyIsInNyYy9jb21tb24vbW9kZWxzL2tvcnZhaS5qcyIsInNyYy9jb21tb24vbW9kZWxzL3Byb2ZpbGUuanMiLCJzcmMvY29tbW9uL3NlcnZpY2VzL2FwaV9zZXJ2aWNlLmpzIiwic3JjL2NvbW1vbi9zZXJ2aWNlcy9hdXRoX3NlcnZpY2UuanMiLCJzcmMvc3RhdGljLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBBdXRoU2VydmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9zZXJ2aWNlcy9hdXRoX3NlcnZpY2UuanMnKTtcblxudmFyIExvZ2luUGFnZSA9IHt9O1xuXG5Mb2dpblBhZ2UuY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdm0gPSB0aGlzO1xuXG4gIHZtLmVtYWlsID0gbS5wcm9wKCcnKTtcbiAgdm0ucGFzc3dvcmQgPSBtLnByb3AoJycpO1xuICB2bS5hbGVydHMgPSBtLnByb3AoW10pO1xuXG4gIHZtLmxvZ2luID0gZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICBpZih2bS5lbWFpbCgpICYmIHZtLnBhc3N3b3JkKCkpIHtcbiAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKHZtLmVtYWlsKCksIHZtLnBhc3N3b3JkKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiL2FwcFwiKTtcbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICB2bS5hbGVydHMoKS5wdXNoKFwiTG9naW4gZmFpbHVyZSFcIik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdm0uYWxlcnRzKCkucHVzaChcIkZpZWxkcyBjYW5ub3QgYmUgZW1wdHlcIik7XG4gICAgfVxuICB9XG59O1xuXG5Mb2dpblBhZ2UudmlldyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgdmFyIGFsZXJ0cyA9IGN0cmwuYWxlcnRzKCkubWFwKGZ1bmN0aW9uKG1zZywgaW5kZXgpIHtcbiAgICByZXR1cm4gKFxuICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcImFsZXJ0IGFsZXJ0LXdhcm5pbmcgYWxlcnQtZGlzbWlzc2libGVcIiwgcm9sZTpcImFsZXJ0XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICB7dGFnOiBcImJ1dHRvblwiLCBhdHRyczoge3R5cGU6XCJidXR0b25cIiwgY2xhc3M6XCJjbG9zZVwiLCBcImRhdGEtZGlzbWlzc1wiOlwiYWxlcnRcIiwgXCJhcmlhLWxhYmVsXCI6XCJDbG9zZVwifSwgY2hpbGRyZW46IFt7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCJ9LCBjaGlsZHJlbjogW1wiw5dcIl19XX0sIFxuICAgICAgICBtc2dcbiAgICAgIF19XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2lkOlwiTG9naW5cIn0sIGNoaWxkcmVuOiBbXG4gICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiY29udGFpbmVyXCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICB7dGFnOiBcImZvcm1cIiwgYXR0cnM6IHtjbGFzczpcImZvcm0tc2lnbmluXCIsIG9uc3VibWl0OmN0cmwubG9naW59LCBjaGlsZHJlbjogW1xuICAgICAgICAgIHt0YWc6IFwiaDJcIiwgYXR0cnM6IHtjbGFzczpcImZvcm0tc2lnbmluLWhlYWRpbmdcIn0sIGNoaWxkcmVuOiBbXCJQbGVhc2Ugc2lnbiBpblwiXX0sIFxuXG4gICAgICAgICAge3RhZzogXCJsYWJlbFwiLCBhdHRyczoge2ZvcjpcImlucHV0RW1haWxcIiwgY2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiRW1haWwgYWRkcmVzc1wiXX0sIFxuICAgICAgICAgIHt0YWc6IFwiaW5wdXRcIiwgYXR0cnM6IHtcbiAgICAgICAgICAgIHR5cGU6XCJlbWFpbFwiLCBcbiAgICAgICAgICAgIGlkOlwiaW5wdXRFbWFpbFwiLCBcbiAgICAgICAgICAgIGNsYXNzOlwiZm9ybS1jb250cm9sXCIsIFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6XCJFbWFpbCBhZGRyZXNzXCIsIFxuICAgICAgICAgICAgb25jaGFuZ2U6bS53aXRoQXR0cigndmFsdWUnLCBjdHJsLmVtYWlsKSwgXG4gICAgICAgICAgICB2YWx1ZTpjdHJsLmVtYWlsKCksIFxuICAgICAgICAgICAgcmVxdWlyZWQ6dHJ1ZSxhdXRvZm9jdXM6dHJ1ZX19LCBcblxuICAgICAgICAgIHt0YWc6IFwibGFiZWxcIiwgYXR0cnM6IHtmb3I6XCJpbnB1dFBhc3N3b3JkXCIsIGNsYXNzOlwic3Itb25seVwifSwgY2hpbGRyZW46IFtcIlBhc3N3b3JkXCJdfSwgXG4gICAgICAgICAge3RhZzogXCJpbnB1dFwiLCBhdHRyczoge1xuICAgICAgICAgICAgdHlwZTpcInBhc3N3b3JkXCIsIFxuICAgICAgICAgICAgaWQ6XCJpbnB1dFBhc3N3b3JkXCIsIFxuICAgICAgICAgICAgY2xhc3M6XCJmb3JtLWNvbnRyb2xcIiwgXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjpcIlBhc3N3b3JkXCIsIFxuICAgICAgICAgICAgb25jaGFuZ2U6bS53aXRoQXR0cigndmFsdWUnLCBjdHJsLnBhc3N3b3JkKSwgXG4gICAgICAgICAgICB2YWx1ZTpjdHJsLnBhc3N3b3JkKCksIFxuICAgICAgICAgICAgcmVxdWlyZWQ6dHJ1ZX19LCBcblxuICAgICAgICAgIHt0YWc6IFwiYnV0dG9uXCIsIGF0dHJzOiB7Y2xhc3M6XCJidG4gYnRuLWxnIGJ0bi1wcmltYXJ5IGJ0bi1ibG9ja1wiLCB0eXBlOlwic3VibWl0XCJ9LCBjaGlsZHJlbjogW1wiU2lnbiBpblwiXX1cbiAgICAgICAgXX0sIFxuXG4gICAgICAgIGFsZXJ0c1xuICAgICAgXX1cbiAgICBdfVxuICApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2dpblBhZ2U7IiwidmFyIEF1dGhTZXJ2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL3NlcnZpY2VzL2F1dGhfc2VydmljZS5qcycpO1xuXG52YXIgUmVnaXN0ZXJQYWdlID0ge307XG5cblJlZ2lzdGVyUGFnZS5jb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciB2bSA9IHRoaXM7XG5cbiAgdm0ubmFtZSA9IG0ucHJvcCgnJyk7XG4gIHZtLmVtYWlsID0gbS5wcm9wKCcnKTtcbiAgdm0ucGFzc3dvcmQgPSBtLnByb3AoJycpO1xuICB2bS5wYXNzd29yZF9jb25maXJtYXRpb24gPSBtLnByb3AoJycpO1xuXG4gIHZtLmFsZXJ0cyA9IG0ucHJvcChbXSk7XG5cbiAgdm0ucmVnaXN0ZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYodm0ubmFtZSgpICYmIHZtLmVtYWlsKCkgJiYgdm0ucGFzc3dvcmQoKSAmJiB2bS5wYXNzd29yZCgpID09IHZtLnBhc3N3b3JkX2NvbmZpcm1hdGlvbigpKSB7XG4gICAgICBBdXRoU2VydmljZS5yZWdpc3Rlcih2bS5uYW1lKCksIHZtLmVtYWlsKCksIHZtLnBhc3N3b3JkKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHZtLmFsZXJ0cygpLnB1c2goXCJSZWdpc3RyYXRpb24gc3VjY2VzcyFcIik7XG4gICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgdm0uYWxlcnRzKCkucHVzaChcIlJlZ2lzdHJhdGlvbiBmYWlsdXJlIVwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2bS5hbGVydHMoKS5wdXNoKFwiUGxlYXNlIHJlY2hlY2sgdGhlIGZpZWxkcywgc29tZXRoaW5nIHdlbnQgd3JvbmdcIik7XG4gICAgfVxuICB9XG59O1xuXG5SZWdpc3RlclBhZ2UudmlldyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgdmFyIGFsZXJ0cyA9IGN0cmwuYWxlcnRzKCkubWFwKGZ1bmN0aW9uKG1zZywgaW5kZXgpIHtcbiAgICByZXR1cm4gKFxuICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcImFsZXJ0IGFsZXJ0LXdhcm5pbmcgYWxlcnQtZGlzbWlzc2libGVcIiwgcm9sZTpcImFsZXJ0XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICB7dGFnOiBcImJ1dHRvblwiLCBhdHRyczoge3R5cGU6XCJidXR0b25cIiwgY2xhc3M6XCJjbG9zZVwiLCBcImRhdGEtZGlzbWlzc1wiOlwiYWxlcnRcIiwgXCJhcmlhLWxhYmVsXCI6XCJDbG9zZVwifSwgY2hpbGRyZW46IFt7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCJ9LCBjaGlsZHJlbjogW1wiw5dcIl19XX0sIFxuICAgICAgICBtc2dcbiAgICAgIF19XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2lkOlwiUmVnaXN0ZXJcIn0sIGNoaWxkcmVuOiBbXG4gICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiY29udGFpbmVyXCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICB7dGFnOiBcImZvcm1cIiwgYXR0cnM6IHtjbGFzczpcImZvcm0tc2lnbmluXCIsIG9uc3VibWl0OmN0cmwucmVnaXN0ZXJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgIHt0YWc6IFwiaDJcIiwgYXR0cnM6IHtjbGFzczpcImZvcm0tc2lnbmluLWhlYWRpbmdcIn0sIGNoaWxkcmVuOiBbXCJSZWdpc3RlciBuZXcgYWNjb3VudFwiXX0sIFxuXG4gICAgICAgICAge3RhZzogXCJsYWJlbFwiLCBhdHRyczoge2ZvcjpcImlucHV0TmFtZVwiLCBjbGFzczpcInNyLW9ubHlcIn0sIGNoaWxkcmVuOiBbXCJOYW1lXCJdfSwgXG4gICAgICAgICAge3RhZzogXCJpbnB1dFwiLCBhdHRyczoge1xuICAgICAgICAgICAgaWQ6XCJpbnB1dE5hbWVcIiwgXG4gICAgICAgICAgICBjbGFzczpcImZvcm0tY29udHJvbFwiLCBcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOlwiTmFtZVwiLCBcbiAgICAgICAgICAgIG9uY2hhbmdlOm0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5uYW1lKSwgXG4gICAgICAgICAgICB2YWx1ZTpjdHJsLm5hbWUoKSwgXG4gICAgICAgICAgICByZXF1aXJlZDp0cnVlLGF1dG9mb2N1czp0cnVlfX0sIFxuXG4gICAgICAgICAge3RhZzogXCJsYWJlbFwiLCBhdHRyczoge2ZvcjpcImlucHV0RW1haWxcIiwgY2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiRW1haWwgYWRkcmVzc1wiXX0sIFxuICAgICAgICAgIHt0YWc6IFwiaW5wdXRcIiwgYXR0cnM6IHtcbiAgICAgICAgICAgIHR5cGU6XCJlbWFpbFwiLCBcbiAgICAgICAgICAgIGlkOlwiaW5wdXRFbWFpbFwiLCBcbiAgICAgICAgICAgIGNsYXNzOlwiZm9ybS1jb250cm9sXCIsIFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6XCJFbWFpbCBhZGRyZXNzXCIsIFxuICAgICAgICAgICAgb25jaGFuZ2U6bS53aXRoQXR0cigndmFsdWUnLCBjdHJsLmVtYWlsKSwgXG4gICAgICAgICAgICB2YWx1ZTpjdHJsLmVtYWlsKCksIFxuICAgICAgICAgICAgcmVxdWlyZWQ6dHJ1ZX19LCBcblxuICAgICAgICAgIHt0YWc6IFwibGFiZWxcIiwgYXR0cnM6IHtmb3I6XCJpbnB1dFBhc3N3b3JkUmVnaXN0ZXJcIiwgY2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiUGFzc3dvcmRcIl19LCBcbiAgICAgICAgICB7dGFnOiBcImlucHV0XCIsIGF0dHJzOiB7XG4gICAgICAgICAgICB0eXBlOlwicGFzc3dvcmRcIiwgXG4gICAgICAgICAgICBpZDpcImlucHV0UGFzc3dvcmRSZWdpc3RlclwiLCBcbiAgICAgICAgICAgIGNsYXNzOlwiZm9ybS1jb250cm9sXCIsIFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6XCJQYXNzd29yZFwiLCBcbiAgICAgICAgICAgIG9uY2hhbmdlOm0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5wYXNzd29yZCksIFxuICAgICAgICAgICAgdmFsdWU6Y3RybC5wYXNzd29yZCgpLCBcbiAgICAgICAgICAgIHJlcXVpcmVkOnRydWV9fSwgXG5cbiAgICAgICAgICB7dGFnOiBcImxhYmVsXCIsIGF0dHJzOiB7Zm9yOlwiaW5wdXRQYXNzd29yZENvbmZpcm1cIiwgY2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiQ29uZmlybSBQYXNzd29yZFwiXX0sIFxuICAgICAgICAgIHt0YWc6IFwiaW5wdXRcIiwgYXR0cnM6IHtcbiAgICAgICAgICAgIHR5cGU6XCJwYXNzd29yZFwiLCBcbiAgICAgICAgICAgIGlkOlwiaW5wdXRQYXNzd29yZENvbmZpcm1cIiwgXG4gICAgICAgICAgICBjbGFzczpcImZvcm0tY29udHJvbFwiLCBcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOlwiQ29uZmlybSBQYXNzd29yZFwiLCBcbiAgICAgICAgICAgIG9uY2hhbmdlOm0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5wYXNzd29yZF9jb25maXJtYXRpb24pLCBcbiAgICAgICAgICAgIHZhbHVlOmN0cmwucGFzc3dvcmRfY29uZmlybWF0aW9uKCksIFxuICAgICAgICAgICAgcmVxdWlyZWQ6dHJ1ZX19LCBcblxuICAgICAgICAgIHt0YWc6IFwiYnV0dG9uXCIsIGF0dHJzOiB7Y2xhc3M6XCJidG4gYnRuLWxnIGJ0bi1wcmltYXJ5IGJ0bi1ibG9ja1wiLCB0eXBlOlwic3VibWl0XCJ9LCBjaGlsZHJlbjogW1wiU2lnbiBpblwiXX1cbiAgICAgICAgXX0sIFxuXG4gICAgICAgIGFsZXJ0c1xuICAgICAgXX1cbiAgICBdfVxuICApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWdpc3RlclBhZ2U7IiwidmFyIEFQSSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2FwaV9zZXJ2aWNlLmpzJyk7XG52YXIgS29ydmFpID0gcmVxdWlyZSgnLi4vbW9kZWxzL2tvcnZhaS5qcycpO1xudmFyIFByb2ZpbGUgPSByZXF1aXJlKCcuLi9tb2RlbHMvcHJvZmlsZS5qcycpO1xuXG52YXIgQ3VycmVudFVzZXIgPSAoZnVuY3Rpb24oKXtcbiAgdmFyIGxvY2FsVXNlckRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXJuYXRpYy1jdXJyZW50VXNlcicpKSB8fCB7fTtcblxuICByZXR1cm4ge1xuICAgIGlkOiBtLnByb3AobG9jYWxVc2VyRGF0YS5pZCB8fCAnJyksXG4gICAgZW1haWw6IG0ucHJvcChsb2NhbFVzZXJEYXRhLmVtYWlsIHx8ICcnKSxcbiAgICBhdXRoX3Rva2VuOiBtLnByb3AobG9jYWxVc2VyRGF0YS5hdXRoX3Rva2VuIHx8ICcnKVxuICB9O1xufSgpKTtcblxuQ3VycmVudFVzZXIuc2V0VXNlciA9IGZ1bmN0aW9uKHVzZXJEYXRhKSB7XG4gIEN1cnJlbnRVc2VyLmlkKHVzZXJEYXRhLmlkKTtcbiAgQ3VycmVudFVzZXIuZW1haWwodXNlckRhdGEuZW1haWwpO1xuICBDdXJyZW50VXNlci5hdXRoX3Rva2VuKHVzZXJEYXRhLmF1dGhfdG9rZW4pO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FybmF0aWMtY3VycmVudFVzZXInLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xufTtcblxuQ3VycmVudFVzZXIuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2Nhcm5hdGljLWN1cnJlbnRVc2VyJyk7XG4gIEN1cnJlbnRVc2VyLmlkKCcnKTtcbiAgQ3VycmVudFVzZXIuZW1haWwoJycpO1xuICBDdXJyZW50VXNlci5hdXRoX3Rva2VuKCcnKTtcbn07XG5cbkN1cnJlbnRVc2VyLnByb2ZpbGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSSgnR0VUJywgJy91c2Vycy8nICsgQ3VycmVudFVzZXIuaWQoKSArICcvcHJvZmlsZScpLnRoZW4oZnVuY3Rpb24ocHJvZmlsZSkge1xuICAgIHJldHVybiBuZXcgUHJvZmlsZShwcm9maWxlKTtcbiAgfSk7XG59O1xuXG5DdXJyZW50VXNlci5rb3J2YWlzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBUEkoJ0dFVCcsICcvdXNlcnMvJyArIEN1cnJlbnRVc2VyLmlkKCkgKyAnL2tvcnZhaXMnKS50aGVuKGZ1bmN0aW9uKGtvcnZhaXMpIHtcbiAgICByZXR1cm4ga29ydmFpcy5tYXAoZnVuY3Rpb24oaywgaW5kZXgpIHtyZXR1cm4gbmV3IEtvcnZhaShrKX0pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ3VycmVudFVzZXI7IiwidmFyIEtvcnZhaSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdGhpcy5pZCA9IG0ucHJvcChkYXRhLmlkIHx8IDApO1xuICB0aGlzLnVzZXJfaWQgPSBtLnByb3AoZGF0YS51c2VyX2lkIHx8IDApO1xuICB0aGlzLmNvbnRlbnQgPSBtLnByb3AoZGF0YS5jb250ZW50IHx8ICcnKTtcbiAgdGhpcy50aGFsYW0gPSBtLnByb3AoZGF0YS50aGFsYW0gfHwgMzIpO1xuICB0aGlzLm1hdHJhc19hZnRlciA9IG0ucHJvcChkYXRhLm1hdHJhc0FmdGVyIHx8IDApO1xuICB0aGlzLmNyZWF0ZWRfYXQgPSBtLnByb3AoZGF0YS5jcmVhdGVkX2F0IHx8ICcnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS29ydmFpOyIsInZhciBBUEkgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9hcGlfc2VydmljZS5qcycpO1xuXG52YXIgUHJvZmlsZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdmFyIHAgPSB0aGlzO1xuXG4gIHAuaWQgPSBtLnByb3AoZGF0YS5pZCB8fCAwKTtcbiAgcC51c2VyX2lkID0gbS5wcm9wKGRhdGEudXNlcl9pZCB8fCAwKTtcbiAgcC5uYW1lID0gbS5wcm9wKGRhdGEubmFtZSB8fCAnJyk7XG5cbiAgcC5waWN0dXJlX3VybCA9IG0ucHJvcChkYXRhLnBpY3R1cmVfdXJsIHx8ICcnKTtcbiAgcC5nZXRTaXplZFBpY3R1cmUgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgcmV0dXJuIHAucGljdHVyZV91cmwoKSArIFwiJnM9XCIgKyBzaXplO1xuICB9XG4gIFxuICBwLmNyZWF0ZWRfYXQgPSBtLnByb3AoZGF0YS5jcmVhdGVkX2F0IHx8ICcnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvZmlsZTsiLCIvLyByZXF1aXJlcyBtZXRob2QgKGUuZy4gR0VULCBQT1NULCBldGMuKVxuLy8gcmVxdWlyZXMgdXJsIChlLmcuICcvdXNlcnMvMScpXG4vLyBvcHRpb25hbCBkYXRhIChqYXZhc2NyaXB0IG9iamVjdClcbi8vIG9wdGlvbmFsIGF1dGhfdG9rZW4gKGlmIGF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkKVxudmFyIEFQSSA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBhdXRoX3Rva2VuKSB7XG4gIHZhciB4aHJDb25maWcgPSBmdW5jdGlvbih4aHIpIHtcbiAgICBpZihhdXRoX3Rva2VuKSB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdUb2tlbiAnICsgYXV0aF90b2tlbik7XG4gIH07XG5cbiAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyArIHVybCxcbiAgICBkYXRhOiBkYXRhIHx8IHt9LFxuICAgIGNvbmZpZzogeGhyQ29uZmlnXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBUEk7IiwidmFyIEN1cnJlbnRVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL2N1cnJlbnRfdXNlci5qcycpO1xudmFyIEFQSVVybCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnO1xuXG52YXIgQXV0aFNlcnZpY2UgPSB7XG4gIHJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lLCBlbWFpbCwgcGFzc3dvcmQpIHtcbiAgICBtLnN0YXJ0Q29tcHV0YXRpb24oKTtcblxuICAgIHJldHVybiBtLnJlcXVlc3Qoe21ldGhvZDogJ1BPU1QnLCB1cmw6IEFQSVVybCArICcvdXNlcnMnLCBkYXRhOiB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiBwYXNzd29yZFxuICAgIH19KS50aGVuKGZ1bmN0aW9uKHVzZXJEYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdHJhdGlvbiBzdWNjZXNzOiBcIiwgdXNlckRhdGEpO1xuICAgICAgQ3VycmVudFVzZXIuc2V0VXNlcih1c2VyRGF0YSk7XG4gICAgICBtLmVuZENvbXB1dGF0aW9uKCk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0cmF0aW9uIGZhaWx1cmU6IFwiLCBlcnJvcik7XG4gICAgICBtLmVuZENvbXB1dGF0aW9uKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgbG9naW46IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCkge1xuICAgIG0uc3RhcnRDb21wdXRhdGlvbigpO1xuXG4gICAgcmV0dXJuIG0ucmVxdWVzdCh7bWV0aG9kOiAnUE9TVCcsIHVybDogQVBJVXJsICsgJy91c2Vycy9sb2dpbicsIGRhdGE6IHtcbiAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgIH19KS50aGVuKGZ1bmN0aW9uKHVzZXJEYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImxvZ2luIHN1Y2Nlc3M6IFwiLCB1c2VyRGF0YSk7XG4gICAgICBDdXJyZW50VXNlci5zZXRVc2VyKHVzZXJEYXRhKTtcbiAgICAgIG0uZW5kQ29tcHV0YXRpb24oKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJsb2dpbiBmYWlsdXJlOiBcIiwgZXJyb3IpO1xuICAgICAgbS5lbmRDb21wdXRhdGlvbigpO1xuICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGhTZXJ2aWNlOyIsInZhciBMb2dpblBhZ2UgPSByZXF1aXJlKCcuL1N0YXRpYy9sb2dpbi5qcycpO1xudmFyIFJlZ2lzdGVyUGFnZSA9IHJlcXVpcmUoJy4vU3RhdGljL3JlZ2lzdGVyLmpzJyk7XG5cbm0ucm91dGUubW9kZSA9ICdoYXNoJztcbm0ucm91dGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1N0YXRpY0NvbnRhaW5lcicpLCAnL2xvZ2luJywge1xuICAnL2xvZ2luJzogTG9naW5QYWdlLFxuICAnL3JlZ2lzdGVyJzogUmVnaXN0ZXJQYWdlXG59KTsiXX0=
