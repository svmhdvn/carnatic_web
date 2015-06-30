(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/siva/Documents/projects/carnatic_mithril/src/Static/register.js":[function(require,module,exports){
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

m.mount(document.getElementById('RegisterContainer'), RegisterPage);
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
},{"../models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js"}]},{},["/home/siva/Documents/projects/carnatic_mithril/src/Static/register.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvU3RhdGljL3JlZ2lzdGVyLmpzIiwic3JjL2NvbW1vbi9tb2RlbHMvY3VycmVudF91c2VyLmpzIiwic3JjL2NvbW1vbi9tb2RlbHMva29ydmFpLmpzIiwic3JjL2NvbW1vbi9tb2RlbHMvcHJvZmlsZS5qcyIsInNyYy9jb21tb24vc2VydmljZXMvYXBpX3NlcnZpY2UuanMiLCJzcmMvY29tbW9uL3NlcnZpY2VzL2F1dGhfc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEF1dGhTZXJ2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL3NlcnZpY2VzL2F1dGhfc2VydmljZS5qcycpO1xuXG52YXIgUmVnaXN0ZXJQYWdlID0ge307XG5cblJlZ2lzdGVyUGFnZS5jb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciB2bSA9IHRoaXM7XG5cbiAgdm0ubmFtZSA9IG0ucHJvcCgnJyk7XG4gIHZtLmVtYWlsID0gbS5wcm9wKCcnKTtcbiAgdm0ucGFzc3dvcmQgPSBtLnByb3AoJycpO1xuICB2bS5wYXNzd29yZF9jb25maXJtYXRpb24gPSBtLnByb3AoJycpO1xuXG4gIHZtLmFsZXJ0cyA9IG0ucHJvcChbXSk7XG5cbiAgdm0ucmVnaXN0ZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYodm0ubmFtZSgpICYmIHZtLmVtYWlsKCkgJiYgdm0ucGFzc3dvcmQoKSAmJiB2bS5wYXNzd29yZCgpID09IHZtLnBhc3N3b3JkX2NvbmZpcm1hdGlvbigpKSB7XG4gICAgICBBdXRoU2VydmljZS5yZWdpc3Rlcih2bS5uYW1lKCksIHZtLmVtYWlsKCksIHZtLnBhc3N3b3JkKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHZtLmFsZXJ0cygpLnB1c2goXCJSZWdpc3RyYXRpb24gc3VjY2VzcyFcIik7XG4gICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgdm0uYWxlcnRzKCkucHVzaChcIlJlZ2lzdHJhdGlvbiBmYWlsdXJlIVwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2bS5hbGVydHMoKS5wdXNoKFwiUGxlYXNlIHJlY2hlY2sgdGhlIGZpZWxkcywgc29tZXRoaW5nIHdlbnQgd3JvbmdcIik7XG4gICAgfVxuICB9XG59O1xuXG5SZWdpc3RlclBhZ2UudmlldyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgdmFyIGFsZXJ0cyA9IGN0cmwuYWxlcnRzKCkubWFwKGZ1bmN0aW9uKG1zZywgaW5kZXgpIHtcbiAgICByZXR1cm4gKFxuICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcImFsZXJ0IGFsZXJ0LXdhcm5pbmcgYWxlcnQtZGlzbWlzc2libGVcIiwgcm9sZTpcImFsZXJ0XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICB7dGFnOiBcImJ1dHRvblwiLCBhdHRyczoge3R5cGU6XCJidXR0b25cIiwgY2xhc3M6XCJjbG9zZVwiLCBcImRhdGEtZGlzbWlzc1wiOlwiYWxlcnRcIiwgXCJhcmlhLWxhYmVsXCI6XCJDbG9zZVwifSwgY2hpbGRyZW46IFt7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCJ9LCBjaGlsZHJlbjogW1wiw5dcIl19XX0sIFxuICAgICAgICBtc2dcbiAgICAgIF19XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2lkOlwiUmVnaXN0ZXJcIn0sIGNoaWxkcmVuOiBbXG4gICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiY29udGFpbmVyXCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICB7dGFnOiBcImZvcm1cIiwgYXR0cnM6IHtjbGFzczpcImZvcm0tc2lnbmluXCIsIG9uc3VibWl0OmN0cmwucmVnaXN0ZXJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgIHt0YWc6IFwiaDJcIiwgYXR0cnM6IHtjbGFzczpcImZvcm0tc2lnbmluLWhlYWRpbmdcIn0sIGNoaWxkcmVuOiBbXCJSZWdpc3RlciBuZXcgYWNjb3VudFwiXX0sIFxuXG4gICAgICAgICAge3RhZzogXCJsYWJlbFwiLCBhdHRyczoge2ZvcjpcImlucHV0TmFtZVwiLCBjbGFzczpcInNyLW9ubHlcIn0sIGNoaWxkcmVuOiBbXCJOYW1lXCJdfSwgXG4gICAgICAgICAge3RhZzogXCJpbnB1dFwiLCBhdHRyczoge1xuICAgICAgICAgICAgaWQ6XCJpbnB1dE5hbWVcIiwgXG4gICAgICAgICAgICBjbGFzczpcImZvcm0tY29udHJvbFwiLCBcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOlwiTmFtZVwiLCBcbiAgICAgICAgICAgIG9uY2hhbmdlOm0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5uYW1lKSwgXG4gICAgICAgICAgICB2YWx1ZTpjdHJsLm5hbWUoKSwgXG4gICAgICAgICAgICByZXF1aXJlZDp0cnVlLGF1dG9mb2N1czp0cnVlfX0sIFxuXG4gICAgICAgICAge3RhZzogXCJsYWJlbFwiLCBhdHRyczoge2ZvcjpcImlucHV0RW1haWxcIiwgY2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiRW1haWwgYWRkcmVzc1wiXX0sIFxuICAgICAgICAgIHt0YWc6IFwiaW5wdXRcIiwgYXR0cnM6IHtcbiAgICAgICAgICAgIHR5cGU6XCJlbWFpbFwiLCBcbiAgICAgICAgICAgIGlkOlwiaW5wdXRFbWFpbFwiLCBcbiAgICAgICAgICAgIGNsYXNzOlwiZm9ybS1jb250cm9sXCIsIFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6XCJFbWFpbCBhZGRyZXNzXCIsIFxuICAgICAgICAgICAgb25jaGFuZ2U6bS53aXRoQXR0cigndmFsdWUnLCBjdHJsLmVtYWlsKSwgXG4gICAgICAgICAgICB2YWx1ZTpjdHJsLmVtYWlsKCksIFxuICAgICAgICAgICAgcmVxdWlyZWQ6dHJ1ZX19LCBcblxuICAgICAgICAgIHt0YWc6IFwibGFiZWxcIiwgYXR0cnM6IHtmb3I6XCJpbnB1dFBhc3N3b3JkUmVnaXN0ZXJcIiwgY2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiUGFzc3dvcmRcIl19LCBcbiAgICAgICAgICB7dGFnOiBcImlucHV0XCIsIGF0dHJzOiB7XG4gICAgICAgICAgICB0eXBlOlwicGFzc3dvcmRcIiwgXG4gICAgICAgICAgICBpZDpcImlucHV0UGFzc3dvcmRSZWdpc3RlclwiLCBcbiAgICAgICAgICAgIGNsYXNzOlwiZm9ybS1jb250cm9sXCIsIFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6XCJQYXNzd29yZFwiLCBcbiAgICAgICAgICAgIG9uY2hhbmdlOm0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5wYXNzd29yZCksIFxuICAgICAgICAgICAgdmFsdWU6Y3RybC5wYXNzd29yZCgpLCBcbiAgICAgICAgICAgIHJlcXVpcmVkOnRydWV9fSwgXG5cbiAgICAgICAgICB7dGFnOiBcImxhYmVsXCIsIGF0dHJzOiB7Zm9yOlwiaW5wdXRQYXNzd29yZENvbmZpcm1cIiwgY2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiQ29uZmlybSBQYXNzd29yZFwiXX0sIFxuICAgICAgICAgIHt0YWc6IFwiaW5wdXRcIiwgYXR0cnM6IHtcbiAgICAgICAgICAgIHR5cGU6XCJwYXNzd29yZFwiLCBcbiAgICAgICAgICAgIGlkOlwiaW5wdXRQYXNzd29yZENvbmZpcm1cIiwgXG4gICAgICAgICAgICBjbGFzczpcImZvcm0tY29udHJvbFwiLCBcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOlwiQ29uZmlybSBQYXNzd29yZFwiLCBcbiAgICAgICAgICAgIG9uY2hhbmdlOm0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5wYXNzd29yZF9jb25maXJtYXRpb24pLCBcbiAgICAgICAgICAgIHZhbHVlOmN0cmwucGFzc3dvcmRfY29uZmlybWF0aW9uKCksIFxuICAgICAgICAgICAgcmVxdWlyZWQ6dHJ1ZX19LCBcblxuICAgICAgICAgIHt0YWc6IFwiYnV0dG9uXCIsIGF0dHJzOiB7Y2xhc3M6XCJidG4gYnRuLWxnIGJ0bi1wcmltYXJ5IGJ0bi1ibG9ja1wiLCB0eXBlOlwic3VibWl0XCJ9LCBjaGlsZHJlbjogW1wiU2lnbiBpblwiXX1cbiAgICAgICAgXX0sIFxuXG4gICAgICAgIGFsZXJ0c1xuICAgICAgXX1cbiAgICBdfVxuICApO1xufTtcblxubS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUmVnaXN0ZXJDb250YWluZXInKSwgUmVnaXN0ZXJQYWdlKTsiLCJ2YXIgQVBJID0gcmVxdWlyZSgnLi4vc2VydmljZXMvYXBpX3NlcnZpY2UuanMnKTtcbnZhciBLb3J2YWkgPSByZXF1aXJlKCcuLi9tb2RlbHMva29ydmFpLmpzJyk7XG52YXIgUHJvZmlsZSA9IHJlcXVpcmUoJy4uL21vZGVscy9wcm9maWxlLmpzJyk7XG5cbnZhciBDdXJyZW50VXNlciA9IChmdW5jdGlvbigpe1xuICB2YXIgbG9jYWxVc2VyRGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Nhcm5hdGljLWN1cnJlbnRVc2VyJykpIHx8IHt9O1xuXG4gIHJldHVybiB7XG4gICAgaWQ6IG0ucHJvcChsb2NhbFVzZXJEYXRhLmlkIHx8ICcnKSxcbiAgICBlbWFpbDogbS5wcm9wKGxvY2FsVXNlckRhdGEuZW1haWwgfHwgJycpLFxuICAgIGF1dGhfdG9rZW46IG0ucHJvcChsb2NhbFVzZXJEYXRhLmF1dGhfdG9rZW4gfHwgJycpXG4gIH07XG59KCkpO1xuXG5DdXJyZW50VXNlci5zZXRVc2VyID0gZnVuY3Rpb24odXNlckRhdGEpIHtcbiAgQ3VycmVudFVzZXIuaWQodXNlckRhdGEuaWQpO1xuICBDdXJyZW50VXNlci5lbWFpbCh1c2VyRGF0YS5lbWFpbCk7XG4gIEN1cnJlbnRVc2VyLmF1dGhfdG9rZW4odXNlckRhdGEuYXV0aF90b2tlbik7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXJuYXRpYy1jdXJyZW50VXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXJEYXRhKSk7XG59O1xuXG5DdXJyZW50VXNlci5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnY2FybmF0aWMtY3VycmVudFVzZXInKTtcbiAgQ3VycmVudFVzZXIuaWQoJycpO1xuICBDdXJyZW50VXNlci5lbWFpbCgnJyk7XG4gIEN1cnJlbnRVc2VyLmF1dGhfdG9rZW4oJycpO1xufTtcblxuQ3VycmVudFVzZXIucHJvZmlsZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQVBJKCdHRVQnLCAnL3VzZXJzLycgKyBDdXJyZW50VXNlci5pZCgpICsgJy9wcm9maWxlJykudGhlbihmdW5jdGlvbihwcm9maWxlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9maWxlKHByb2ZpbGUpO1xuICB9KTtcbn07XG5cbkN1cnJlbnRVc2VyLmtvcnZhaXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSSgnR0VUJywgJy91c2Vycy8nICsgQ3VycmVudFVzZXIuaWQoKSArICcva29ydmFpcycpLnRoZW4oZnVuY3Rpb24oa29ydmFpcykge1xuICAgIHJldHVybiBrb3J2YWlzLm1hcChmdW5jdGlvbihrLCBpbmRleCkge3JldHVybiBuZXcgS29ydmFpKGspfSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXJyZW50VXNlcjsiLCJ2YXIgS29ydmFpID0gZnVuY3Rpb24oZGF0YSkge1xuICB0aGlzLmlkID0gbS5wcm9wKGRhdGEuaWQgfHwgMCk7XG4gIHRoaXMudXNlcl9pZCA9IG0ucHJvcChkYXRhLnVzZXJfaWQgfHwgMCk7XG4gIHRoaXMuY29udGVudCA9IG0ucHJvcChkYXRhLmNvbnRlbnQgfHwgJycpO1xuICB0aGlzLnRoYWxhbSA9IG0ucHJvcChkYXRhLnRoYWxhbSB8fCAzMik7XG4gIHRoaXMubWF0cmFzX2FmdGVyID0gbS5wcm9wKGRhdGEubWF0cmFzQWZ0ZXIgfHwgMCk7XG4gIHRoaXMuY3JlYXRlZF9hdCA9IG0ucHJvcChkYXRhLmNyZWF0ZWRfYXQgfHwgJycpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLb3J2YWk7IiwidmFyIEFQSSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2FwaV9zZXJ2aWNlLmpzJyk7XG5cbnZhciBQcm9maWxlID0gZnVuY3Rpb24oZGF0YSkge1xuICB2YXIgcCA9IHRoaXM7XG5cbiAgcC5pZCA9IG0ucHJvcChkYXRhLmlkIHx8IDApO1xuICBwLnVzZXJfaWQgPSBtLnByb3AoZGF0YS51c2VyX2lkIHx8IDApO1xuICBwLm5hbWUgPSBtLnByb3AoZGF0YS5uYW1lIHx8ICcnKTtcblxuICBwLnBpY3R1cmVfdXJsID0gbS5wcm9wKGRhdGEucGljdHVyZV91cmwgfHwgJycpO1xuICBwLmdldFNpemVkUGljdHVyZSA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICByZXR1cm4gcC5waWN0dXJlX3VybCgpICsgXCImcz1cIiArIHNpemU7XG4gIH1cbiAgXG4gIHAuY3JlYXRlZF9hdCA9IG0ucHJvcChkYXRhLmNyZWF0ZWRfYXQgfHwgJycpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9maWxlOyIsIi8vIHJlcXVpcmVzIG1ldGhvZCAoZS5nLiBHRVQsIFBPU1QsIGV0Yy4pXG4vLyByZXF1aXJlcyB1cmwgKGUuZy4gJy91c2Vycy8xJylcbi8vIG9wdGlvbmFsIGRhdGEgKGphdmFzY3JpcHQgb2JqZWN0KVxuLy8gb3B0aW9uYWwgYXV0aF90b2tlbiAoaWYgYXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQpXG52YXIgQVBJID0gZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIGF1dGhfdG9rZW4pIHtcbiAgdmFyIHhockNvbmZpZyA9IGZ1bmN0aW9uKHhocikge1xuICAgIGlmKGF1dGhfdG9rZW4pIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ1Rva2VuICcgKyBhdXRoX3Rva2VuKTtcbiAgfTtcblxuICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnICsgdXJsLFxuICAgIGRhdGE6IGRhdGEgfHwge30sXG4gICAgY29uZmlnOiB4aHJDb25maWdcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFQSTsiLCJ2YXIgQ3VycmVudFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvY3VycmVudF91c2VyLmpzJyk7XG52YXIgQVBJVXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCc7XG5cbnZhciBBdXRoU2VydmljZSA9IHtcbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUsIGVtYWlsLCBwYXNzd29yZCkge1xuICAgIG0uc3RhcnRDb21wdXRhdGlvbigpO1xuXG4gICAgcmV0dXJuIG0ucmVxdWVzdCh7bWV0aG9kOiAnUE9TVCcsIHVybDogQVBJVXJsICsgJy91c2VycycsIGRhdGE6IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBlbWFpbDogZW1haWwsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICBwYXNzd29yZF9jb25maXJtYXRpb246IHBhc3N3b3JkXG4gICAgfX0pLnRoZW4oZnVuY3Rpb24odXNlckRhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0cmF0aW9uIHN1Y2Nlc3M6IFwiLCB1c2VyRGF0YSk7XG4gICAgICBDdXJyZW50VXNlci5zZXRVc2VyKHVzZXJEYXRhKTtcbiAgICAgIG0uZW5kQ29tcHV0YXRpb24oKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJyZWdpc3RyYXRpb24gZmFpbHVyZTogXCIsIGVycm9yKTtcbiAgICAgIG0uZW5kQ29tcHV0YXRpb24oKTtcbiAgICB9KTtcbiAgfSxcblxuICBsb2dpbjogZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkKSB7XG4gICAgbS5zdGFydENvbXB1dGF0aW9uKCk7XG5cbiAgICByZXR1cm4gbS5yZXF1ZXN0KHttZXRob2Q6ICdQT1NUJywgdXJsOiBBUElVcmwgKyAnL3VzZXJzL2xvZ2luJywgZGF0YToge1xuICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgfX0pLnRoZW4oZnVuY3Rpb24odXNlckRhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibG9naW4gc3VjY2VzczogXCIsIHVzZXJEYXRhKTtcbiAgICAgIEN1cnJlbnRVc2VyLnNldFVzZXIodXNlckRhdGEpO1xuICAgICAgbS5lbmRDb21wdXRhdGlvbigpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGZhaWx1cmU6IFwiLCBlcnJvcik7XG4gICAgICBtLmVuZENvbXB1dGF0aW9uKCk7XG4gICAgfSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aFNlcnZpY2U7Il19
