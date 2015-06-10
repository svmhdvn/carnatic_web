(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/siva/Documents/projects/carnatic_mithril/src/Login/login.js":[function(require,module,exports){
var CurrentUser = require('../common/models/current_user.js');
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
        console.log('Current user model: ', CurrentUser);
        vm.alerts().push("Login success!");
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

          {tag: "div", attrs: {class:"checkbox"}, children: [
            {tag: "label", attrs: {}, children: [
              {tag: "input", attrs: {type:"checkbox", value:"remember-me"}}, " Remember me"
            ]}
          ]}, 

          {tag: "button", attrs: {class:"btn btn-lg btn-primary btn-block", type:"submit"}, children: ["Sign in"]}
        ]}, 

        alerts
      ]}
    ]}
  );
};

module.exports = LoginPage;
},{"../common/models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js","../common/services/auth_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/auth_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/Profile/korvais.js":[function(require,module,exports){
var AppLayout = require('../common/layouts/app_layout.js');
var Korvai = require('../common/models/korvai.js');
var CurrentUser = require('../common/models/current_user.js');

var ProfileKorvaisPage = {};

ProfileKorvaisPage.controller = function() {
  var vm = this;
  var korvaisRef = new Firebase('https://carnatic.firebaseio.com/korvais/' + CurrentUser.uid());

  vm.korvais = m.prop([]);
  var initialKorvaisLoaded = false;

  korvaisRef.on('child_added', function(snapshot) {
    if(initialKorvaisLoaded) {
      vm.korvais().push(new Korvai(snapshot.val()));
      m.redraw();
    }
  });

  korvaisRef.once('value', function(snapshot) {
    initialKorvaisLoaded = true;
    data = snapshot.val();

    for(var k in snapshot.val()) {
      vm.korvais().push(new Korvai(data[k]));
    }
    
    m.redraw();
  });
};

ProfileKorvaisPage.view = AppLayout(function(ctrl) {
  var korvais = ctrl.korvais().map(function(korvai, index) {
    var title = "Thalam: " + korvai.thalam() + ", Matras after: " + korvai.matrasAfter();

    return (
      {tag: "div", attrs: {class:"panel panel-primary"}, children: [
        {tag: "div", attrs: {class:"panel-heading"}, children: [
          {tag: "h3", attrs: {class:"panel-title"}, children: [title]}
        ]}, 
        {tag: "div", attrs: {class:"panel-body"}, children: [
          korvai.content()
        ]}
      ]}
    );
  });

  return (
    {tag: "div", attrs: {id:"ProfileKorvais"}, children: [
      {tag: "h1", attrs: {}, children: ["Korvais View"]}, {tag: "br", attrs: {}}, 
      korvais
    ]}
  );
});

module.exports = ProfileKorvaisPage;
},{"../common/layouts/app_layout.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/layouts/app_layout.js","../common/models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js","../common/models/korvai.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/korvai.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/Profile/profile.js":[function(require,module,exports){
var AppLayout = require('../common/layouts/app_layout.js');
var CurrentUser = require('../common/models/current_user.js');

var ProfilePage = {};

ProfilePage.controller = function() {
  this.uid = CurrentUser.uid();
  this.gravatarUrl = 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(CurrentUser.email()) + '?d=mm&s=256';
};

ProfilePage.view = AppLayout(function(ctrl) {
  return (
    {tag: "div", attrs: {class:"container", id:"Profile"}, children: [
      {tag: "div", attrs: {class:"row"}, children: [
        {tag: "div", attrs: {class:"col-md-8 col-xs-10"}, children: [
          {tag: "div", attrs: {class:"well panel panel-default"}, children: [
            {tag: "div", attrs: {class:"panel-body"}, children: [
              {tag: "div", attrs: {class:"row"}, children: [
                {tag: "div", attrs: {class:"col-xs-12 col-sm-4 text-center"}, children: [
                  {tag: "img", attrs: {src:ctrl.gravatarUrl, alt:"Profile picture", class:"center-block img-circle img-thumbnail img-responsive"}}, 
                  {tag: "ul", attrs: {class:"list-inline ratings text-center", title:"Ratings"}, children: [
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}, 
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}, 
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}, 
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}, 
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}
                  ]}
                ]}, 

                {tag: "div", attrs: {class:"col-xs-12 col-sm-8"}, children: [
                  {tag: "h2", attrs: {}, children: [ctrl.uid]}, 
                  {tag: "p", attrs: {}, children: [{tag: "strong", attrs: {}, children: ["About: "]}, " Web Designer / UI Expert. "]}, 
                  {tag: "p", attrs: {}, children: [{tag: "strong", attrs: {}, children: ["Hobbies: "]}, " Read, out with friends, listen to music, draw and learn new things. "]}, 
                  {tag: "p", attrs: {}, children: [{tag: "strong", attrs: {}, children: ["Skills: "]}, 
                    {tag: "span", attrs: {class:"label label-info tags"}, children: ["html5"]}, 
                    {tag: "span", attrs: {class:"label label-info tags"}, children: ["css3"]}, 
                    {tag: "span", attrs: {class:"label label-info tags"}, children: ["jquery"]}, 
                    {tag: "span", attrs: {class:"label label-info tags"}, children: ["bootstrap3"]}
                  ]}
                ]}, 

                {tag: "div", attrs: {class:"clearfix"}}, 
                {tag: "div", attrs: {class:"col-xs-12 col-sm-4"}, children: [
                  {tag: "h2", attrs: {}, children: [{tag: "strong", attrs: {}, children: [" 20,7K "]}]}, 
                  {tag: "p", attrs: {}, children: [{tag: "small", attrs: {}, children: ["Followers"]}]}, 
                  {tag: "button", attrs: {class:"btn btn-success btn-block"}, children: [{tag: "span", attrs: {class:"fa fa-plus-circle"}}, " Follow "]}
                ]}, 

                {tag: "div", attrs: {class:"col-xs-12 col-sm-4"}, children: [
                  {tag: "h2", attrs: {}, children: [{tag: "strong", attrs: {}, children: ["245"]}]}, 
                  {tag: "p", attrs: {}, children: [{tag: "small", attrs: {}, children: ["Following"]}]}, 
                  {tag: "button", attrs: {class:"btn btn-info btn-block"}, children: [{tag: "span", attrs: {class:"fa fa-user"}}, " View Profile "]}
                ]}, 

                {tag: "div", attrs: {class:"col-xs-12 col-sm-4"}, children: [
                  {tag: "h2", attrs: {}, children: [{tag: "strong", attrs: {}, children: ["43"]}]}, 
                  {tag: "p", attrs: {}, children: [{tag: "small", attrs: {}, children: ["Snippets"]}]}, 
                  {tag: "button", attrs: {type:"button", class:"btn btn-primary btn-block"}, children: [{tag: "span", attrs: {class:"fa fa-gear"}}, " Options "]}
                ]}
              ]}
            ]}
          ]}
        ]}
      ]}
    ]}
  );
});

module.exports = ProfilePage;
},{"../common/layouts/app_layout.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/layouts/app_layout.js","../common/models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/app.js":[function(require,module,exports){
var LoginPage = require('./Login/login.js');
var ProfilePage = require('./Profile/profile.js');
var ProfileKorvaisPage = require('./Profile/korvais.js');

var CurrentUser = require('./common/models/current_user.js');

var Authenticated = function(module) {
  return {
    controller: function() { return new Authenticated.controller(module); },
    view: Authenticated.view
  };
};

Authenticated.controller = function(module) {
  if(!CurrentUser.uid()) m.route('/login');
  this.content = module.view.bind(this, new module.controller);
};

Authenticated.view = function(ctrl) {
  return m("#Authenticated", ctrl.content());
};

// helpers

String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
};

String.prototype.replaceAll = function(find, replace) {
  return this.replace(new RegExp(find, 'g'), replace);
};

Array.prototype.removeDuplicates = function() {
  return this.reduce(function(accum, current) {
    if(accum.indexOf(current) < 0) accum.push(current);
    return accum;
  }, []);
};

// routes

m.route.mode = 'hash';
m.route(document.getElementById('app'), '/login', {
  '/login': LoginPage,
  '/korvais': Authenticated(ProfileKorvaisPage),
  '/me': Authenticated(ProfilePage)
});
},{"./Login/login.js":"/home/siva/Documents/projects/carnatic_mithril/src/Login/login.js","./Profile/korvais.js":"/home/siva/Documents/projects/carnatic_mithril/src/Profile/korvais.js","./Profile/profile.js":"/home/siva/Documents/projects/carnatic_mithril/src/Profile/profile.js","./common/models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/common/layouts/app_layout.js":[function(require,module,exports){
var CurrentUser = require('../models/current_user.js');

var Header = {};

Header.controller = function() {
  this.uid = CurrentUser.uid();
};

Header.view = function(ctrl) {
  return (
    {tag: "nav", attrs: {class:"navbar navbar-inverse navbar-fixed-top", id:"Header"}, children: [
      {tag: "div", attrs: {class:"container-fluid"}, children: [
        {tag: "div", attrs: {class:"navbar-header"}, children: [
          {tag: "button", attrs: {type:"button", class:"navbar-toggle collapsed", "data-toggle":"collapse", "data-target":"#navbar", "aria-expanded":"false", "aria-controls":"navbar"}, children: [
            {tag: "span", attrs: {class:"sr-only"}, children: ["Toggle navigation"]}, 
            {tag: "span", attrs: {class:"icon-bar"}}, 
            {tag: "span", attrs: {class:"icon-bar"}}, 
            {tag: "span", attrs: {class:"icon-bar"}}
          ]}, 
          {tag: "a", attrs: {class:"navbar-brand", href:"#", id:"logo"}, children: ["Carnatic"]}
        ]}, 

        {tag: "div", attrs: {id:"navbar", class:"navbar-collapse collapse"}, children: [
          {tag: "ul", attrs: {class:"nav navbar-nav navbar-right"}, children: [
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: ["Dashboard"]}]}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: ["Settings"]}]}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: ["Profile"]}]}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: ["Help"]}]}, 
            {tag: "li", attrs: {class:"divider"}}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#/me"}, children: [ctrl.uid]}]}
          ]}
        ]}
      ]}
    ]}
  );
};

var AppLayout = function(view) {
  return function(ctrl) {
    return (
      {tag: "div", attrs: {id:"AppLayout"}, children: [
        Header, 
        {tag: "div", attrs: {class:"container-fluid"}, children: [
          view(ctrl)
        ]}
      ]}
    );
  };
};

module.exports = AppLayout;
},{"../models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js":[function(require,module,exports){
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
},{}],"/home/siva/Documents/projects/carnatic_mithril/src/common/models/korvai.js":[function(require,module,exports){
var Korvai = function(data) {
  this.content = m.prop(data.content || '');
  this.thalam = m.prop(data.thalam || 32);
  this.matrasAfter = m.prop(data.matrasAfter || 0);
};

module.exports = Korvai;
},{}],"/home/siva/Documents/projects/carnatic_mithril/src/common/services/auth_service.js":[function(require,module,exports){
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
},{"../models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js"}]},{},["/home/siva/Documents/projects/carnatic_mithril/src/app.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTG9naW4vbG9naW4uanMiLCJzcmMvUHJvZmlsZS9rb3J2YWlzLmpzIiwic3JjL1Byb2ZpbGUvcHJvZmlsZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvY29tbW9uL2xheW91dHMvYXBwX2xheW91dC5qcyIsInNyYy9jb21tb24vbW9kZWxzL2N1cnJlbnRfdXNlci5qcyIsInNyYy9jb21tb24vbW9kZWxzL2tvcnZhaS5qcyIsInNyYy9jb21tb24vc2VydmljZXMvYXV0aF9zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBDdXJyZW50VXNlciA9IHJlcXVpcmUoJy4uL2NvbW1vbi9tb2RlbHMvY3VycmVudF91c2VyLmpzJyk7XG52YXIgQXV0aFNlcnZpY2UgPSByZXF1aXJlKCcuLi9jb21tb24vc2VydmljZXMvYXV0aF9zZXJ2aWNlLmpzJyk7XG5cbnZhciBMb2dpblBhZ2UgPSB7fTtcblxuTG9naW5QYWdlLmNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHZtID0gdGhpcztcblxuICB2bS5lbWFpbCA9IG0ucHJvcCgnJyk7XG4gIHZtLnBhc3N3b3JkID0gbS5wcm9wKCcnKTtcbiAgdm0uYWxlcnRzID0gbS5wcm9wKFtdKTtcblxuICB2bS5sb2dpbiA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZih2bS5lbWFpbCgpICYmIHZtLnBhc3N3b3JkKCkpIHtcbiAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKHZtLmVtYWlsKCksIHZtLnBhc3N3b3JkKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDdXJyZW50IHVzZXIgbW9kZWw6ICcsIEN1cnJlbnRVc2VyKTtcbiAgICAgICAgdm0uYWxlcnRzKCkucHVzaChcIkxvZ2luIHN1Y2Nlc3MhXCIpO1xuICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZtLmFsZXJ0cygpLnB1c2goXCJMb2dpbiBmYWlsdXJlIVwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2bS5hbGVydHMoKS5wdXNoKFwiRmllbGRzIGNhbm5vdCBiZSBlbXB0eVwiKTtcbiAgICB9XG4gIH1cbn07XG5cbkxvZ2luUGFnZS52aWV3ID0gZnVuY3Rpb24oY3RybCkge1xuICB2YXIgYWxlcnRzID0gY3RybC5hbGVydHMoKS5tYXAoZnVuY3Rpb24obXNnLCBpbmRleCkge1xuICAgIHJldHVybiAoXG4gICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiYWxlcnQgYWxlcnQtd2FybmluZyBhbGVydC1kaXNtaXNzaWJsZVwiLCByb2xlOlwiYWxlcnRcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgIHt0YWc6IFwiYnV0dG9uXCIsIGF0dHJzOiB7dHlwZTpcImJ1dHRvblwiLCBjbGFzczpcImNsb3NlXCIsIFwiZGF0YS1kaXNtaXNzXCI6XCJhbGVydFwiLCBcImFyaWEtbGFiZWxcIjpcIkNsb3NlXCJ9LCBjaGlsZHJlbjogW3t0YWc6IFwic3BhblwiLCBhdHRyczoge1wiYXJpYS1oaWRkZW5cIjpcInRydWVcIn0sIGNoaWxkcmVuOiBbXCLDl1wiXX1dfSwgXG4gICAgICAgIG1zZ1xuICAgICAgXX1cbiAgICApO1xuICB9KTtcblxuICByZXR1cm4gKFxuICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7aWQ6XCJMb2dpblwifSwgY2hpbGRyZW46IFtcbiAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb250YWluZXJcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgIHt0YWc6IFwiZm9ybVwiLCBhdHRyczoge2NsYXNzOlwiZm9ybS1zaWduaW5cIiwgb25zdWJtaXQ6Y3RybC5sb2dpbn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAge3RhZzogXCJoMlwiLCBhdHRyczoge2NsYXNzOlwiZm9ybS1zaWduaW4taGVhZGluZ1wifSwgY2hpbGRyZW46IFtcIlBsZWFzZSBzaWduIGluXCJdfSwgXG5cbiAgICAgICAgICB7dGFnOiBcImxhYmVsXCIsIGF0dHJzOiB7Zm9yOlwiaW5wdXRFbWFpbFwiLCBjbGFzczpcInNyLW9ubHlcIn0sIGNoaWxkcmVuOiBbXCJFbWFpbCBhZGRyZXNzXCJdfSwgXG4gICAgICAgICAge3RhZzogXCJpbnB1dFwiLCBhdHRyczoge1xuICAgICAgICAgICAgdHlwZTpcImVtYWlsXCIsIFxuICAgICAgICAgICAgaWQ6XCJpbnB1dEVtYWlsXCIsIFxuICAgICAgICAgICAgY2xhc3M6XCJmb3JtLWNvbnRyb2xcIiwgXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjpcIkVtYWlsIGFkZHJlc3NcIiwgXG4gICAgICAgICAgICBvbmNoYW5nZTptLndpdGhBdHRyKCd2YWx1ZScsIGN0cmwuZW1haWwpLCBcbiAgICAgICAgICAgIHZhbHVlOmN0cmwuZW1haWwoKSwgXG4gICAgICAgICAgICByZXF1aXJlZDp0cnVlLGF1dG9mb2N1czp0cnVlfX0sIFxuXG4gICAgICAgICAge3RhZzogXCJsYWJlbFwiLCBhdHRyczoge2ZvcjpcImlucHV0UGFzc3dvcmRcIiwgY2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiUGFzc3dvcmRcIl19LCBcbiAgICAgICAgICB7dGFnOiBcImlucHV0XCIsIGF0dHJzOiB7XG4gICAgICAgICAgICB0eXBlOlwicGFzc3dvcmRcIiwgXG4gICAgICAgICAgICBpZDpcImlucHV0UGFzc3dvcmRcIiwgXG4gICAgICAgICAgICBjbGFzczpcImZvcm0tY29udHJvbFwiLCBcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOlwiUGFzc3dvcmRcIiwgXG4gICAgICAgICAgICBvbmNoYW5nZTptLndpdGhBdHRyKCd2YWx1ZScsIGN0cmwucGFzc3dvcmQpLCBcbiAgICAgICAgICAgIHZhbHVlOmN0cmwucGFzc3dvcmQoKSwgXG4gICAgICAgICAgICByZXF1aXJlZDp0cnVlfX0sIFxuXG4gICAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcImNoZWNrYm94XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAge3RhZzogXCJsYWJlbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgIHt0YWc6IFwiaW5wdXRcIiwgYXR0cnM6IHt0eXBlOlwiY2hlY2tib3hcIiwgdmFsdWU6XCJyZW1lbWJlci1tZVwifX0sIFwiIFJlbWVtYmVyIG1lXCJcbiAgICAgICAgICAgIF19XG4gICAgICAgICAgXX0sIFxuXG4gICAgICAgICAge3RhZzogXCJidXR0b25cIiwgYXR0cnM6IHtjbGFzczpcImJ0biBidG4tbGcgYnRuLXByaW1hcnkgYnRuLWJsb2NrXCIsIHR5cGU6XCJzdWJtaXRcIn0sIGNoaWxkcmVuOiBbXCJTaWduIGluXCJdfVxuICAgICAgICBdfSwgXG5cbiAgICAgICAgYWxlcnRzXG4gICAgICBdfVxuICAgIF19XG4gICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2luUGFnZTsiLCJ2YXIgQXBwTGF5b3V0ID0gcmVxdWlyZSgnLi4vY29tbW9uL2xheW91dHMvYXBwX2xheW91dC5qcycpO1xudmFyIEtvcnZhaSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9tb2RlbHMva29ydmFpLmpzJyk7XG52YXIgQ3VycmVudFVzZXIgPSByZXF1aXJlKCcuLi9jb21tb24vbW9kZWxzL2N1cnJlbnRfdXNlci5qcycpO1xuXG52YXIgUHJvZmlsZUtvcnZhaXNQYWdlID0ge307XG5cblByb2ZpbGVLb3J2YWlzUGFnZS5jb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciB2bSA9IHRoaXM7XG4gIHZhciBrb3J2YWlzUmVmID0gbmV3IEZpcmViYXNlKCdodHRwczovL2Nhcm5hdGljLmZpcmViYXNlaW8uY29tL2tvcnZhaXMvJyArIEN1cnJlbnRVc2VyLnVpZCgpKTtcblxuICB2bS5rb3J2YWlzID0gbS5wcm9wKFtdKTtcbiAgdmFyIGluaXRpYWxLb3J2YWlzTG9hZGVkID0gZmFsc2U7XG5cbiAga29ydmFpc1JlZi5vbignY2hpbGRfYWRkZWQnLCBmdW5jdGlvbihzbmFwc2hvdCkge1xuICAgIGlmKGluaXRpYWxLb3J2YWlzTG9hZGVkKSB7XG4gICAgICB2bS5rb3J2YWlzKCkucHVzaChuZXcgS29ydmFpKHNuYXBzaG90LnZhbCgpKSk7XG4gICAgICBtLnJlZHJhdygpO1xuICAgIH1cbiAgfSk7XG5cbiAga29ydmFpc1JlZi5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uKHNuYXBzaG90KSB7XG4gICAgaW5pdGlhbEtvcnZhaXNMb2FkZWQgPSB0cnVlO1xuICAgIGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcblxuICAgIGZvcih2YXIgayBpbiBzbmFwc2hvdC52YWwoKSkge1xuICAgICAgdm0ua29ydmFpcygpLnB1c2gobmV3IEtvcnZhaShkYXRhW2tdKSk7XG4gICAgfVxuICAgIFxuICAgIG0ucmVkcmF3KCk7XG4gIH0pO1xufTtcblxuUHJvZmlsZUtvcnZhaXNQYWdlLnZpZXcgPSBBcHBMYXlvdXQoZnVuY3Rpb24oY3RybCkge1xuICB2YXIga29ydmFpcyA9IGN0cmwua29ydmFpcygpLm1hcChmdW5jdGlvbihrb3J2YWksIGluZGV4KSB7XG4gICAgdmFyIHRpdGxlID0gXCJUaGFsYW06IFwiICsga29ydmFpLnRoYWxhbSgpICsgXCIsIE1hdHJhcyBhZnRlcjogXCIgKyBrb3J2YWkubWF0cmFzQWZ0ZXIoKTtcblxuICAgIHJldHVybiAoXG4gICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwicGFuZWwgcGFuZWwtcHJpbWFyeVwifSwgY2hpbGRyZW46IFtcbiAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcInBhbmVsLWhlYWRpbmdcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAge3RhZzogXCJoM1wiLCBhdHRyczoge2NsYXNzOlwicGFuZWwtdGl0bGVcIn0sIGNoaWxkcmVuOiBbdGl0bGVdfVxuICAgICAgICBdfSwgXG4gICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJwYW5lbC1ib2R5XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgIGtvcnZhaS5jb250ZW50KClcbiAgICAgICAgXX1cbiAgICAgIF19XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2lkOlwiUHJvZmlsZUtvcnZhaXNcIn0sIGNoaWxkcmVuOiBbXG4gICAgICB7dGFnOiBcImgxXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFtcIktvcnZhaXMgVmlld1wiXX0sIHt0YWc6IFwiYnJcIiwgYXR0cnM6IHt9fSwgXG4gICAgICBrb3J2YWlzXG4gICAgXX1cbiAgKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2ZpbGVLb3J2YWlzUGFnZTsiLCJ2YXIgQXBwTGF5b3V0ID0gcmVxdWlyZSgnLi4vY29tbW9uL2xheW91dHMvYXBwX2xheW91dC5qcycpO1xudmFyIEN1cnJlbnRVc2VyID0gcmVxdWlyZSgnLi4vY29tbW9uL21vZGVscy9jdXJyZW50X3VzZXIuanMnKTtcblxudmFyIFByb2ZpbGVQYWdlID0ge307XG5cblByb2ZpbGVQYWdlLmNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy51aWQgPSBDdXJyZW50VXNlci51aWQoKTtcbiAgdGhpcy5ncmF2YXRhclVybCA9ICdodHRwOi8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvJyArIENyeXB0b0pTLk1ENShDdXJyZW50VXNlci5lbWFpbCgpKSArICc/ZD1tbSZzPTI1Nic7XG59O1xuXG5Qcm9maWxlUGFnZS52aWV3ID0gQXBwTGF5b3V0KGZ1bmN0aW9uKGN0cmwpIHtcbiAgcmV0dXJuIChcbiAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiY29udGFpbmVyXCIsIGlkOlwiUHJvZmlsZVwifSwgY2hpbGRyZW46IFtcbiAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJyb3dcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb2wtbWQtOCBjb2wteHMtMTBcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcIndlbGwgcGFuZWwgcGFuZWwtZGVmYXVsdFwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJwYW5lbC1ib2R5XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwicm93XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb2wteHMtMTIgY29sLXNtLTQgdGV4dC1jZW50ZXJcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcImltZ1wiLCBhdHRyczoge3NyYzpjdHJsLmdyYXZhdGFyVXJsLCBhbHQ6XCJQcm9maWxlIHBpY3R1cmVcIiwgY2xhc3M6XCJjZW50ZXItYmxvY2sgaW1nLWNpcmNsZSBpbWctdGh1bWJuYWlsIGltZy1yZXNwb25zaXZlXCJ9fSwgXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcInVsXCIsIGF0dHJzOiB7Y2xhc3M6XCJsaXN0LWlubGluZSByYXRpbmdzIHRleHQtY2VudGVyXCIsIHRpdGxlOlwiUmF0aW5nc1wifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJhXCIsIGF0dHJzOiB7aHJlZjpcIiNcIn0sIGNoaWxkcmVuOiBbe3RhZzogXCJzcGFuXCIsIGF0dHJzOiB7Y2xhc3M6XCJmYSBmYS1zdGFyIGZhLWxnXCJ9fV19XX0sIFxuICAgICAgICAgICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtocmVmOlwiI1wifSwgY2hpbGRyZW46IFt7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtjbGFzczpcImZhIGZhLXN0YXIgZmEtbGdcIn19XX1dfSwgXG4gICAgICAgICAgICAgICAgICAgIHt0YWc6IFwibGlcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3t0YWc6IFwiYVwiLCBhdHRyczoge2hyZWY6XCIjXCJ9LCBjaGlsZHJlbjogW3t0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiZmEgZmEtc3RhciBmYS1sZ1wifX1dfV19LCBcbiAgICAgICAgICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJhXCIsIGF0dHJzOiB7aHJlZjpcIiNcIn0sIGNoaWxkcmVuOiBbe3RhZzogXCJzcGFuXCIsIGF0dHJzOiB7Y2xhc3M6XCJmYSBmYS1zdGFyIGZhLWxnXCJ9fV19XX0sIFxuICAgICAgICAgICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtocmVmOlwiI1wifSwgY2hpbGRyZW46IFt7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtjbGFzczpcImZhIGZhLXN0YXIgZmEtbGdcIn19XX1dfVxuICAgICAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgICBdfSwgXG5cbiAgICAgICAgICAgICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiY29sLXhzLTEyIGNvbC1zbS04XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAge3RhZzogXCJoMlwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbY3RybC51aWRdfSwgXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcInBcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3t0YWc6IFwic3Ryb25nXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFtcIkFib3V0OiBcIl19LCBcIiBXZWIgRGVzaWduZXIgLyBVSSBFeHBlcnQuIFwiXX0sIFxuICAgICAgICAgICAgICAgICAge3RhZzogXCJwXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcInN0cm9uZ1wiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJIb2JiaWVzOiBcIl19LCBcIiBSZWFkLCBvdXQgd2l0aCBmcmllbmRzLCBsaXN0ZW4gdG8gbXVzaWMsIGRyYXcgYW5kIGxlYXJuIG5ldyB0aGluZ3MuIFwiXX0sIFxuICAgICAgICAgICAgICAgICAge3RhZzogXCJwXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcInN0cm9uZ1wiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJTa2lsbHM6IFwiXX0sIFxuICAgICAgICAgICAgICAgICAgICB7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtjbGFzczpcImxhYmVsIGxhYmVsLWluZm8gdGFnc1wifSwgY2hpbGRyZW46IFtcImh0bWw1XCJdfSwgXG4gICAgICAgICAgICAgICAgICAgIHt0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwibGFiZWwgbGFiZWwtaW5mbyB0YWdzXCJ9LCBjaGlsZHJlbjogW1wiY3NzM1wiXX0sIFxuICAgICAgICAgICAgICAgICAgICB7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtjbGFzczpcImxhYmVsIGxhYmVsLWluZm8gdGFnc1wifSwgY2hpbGRyZW46IFtcImpxdWVyeVwiXX0sIFxuICAgICAgICAgICAgICAgICAgICB7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtjbGFzczpcImxhYmVsIGxhYmVsLWluZm8gdGFnc1wifSwgY2hpbGRyZW46IFtcImJvb3RzdHJhcDNcIl19XG4gICAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAgIF19LCBcblxuICAgICAgICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjbGVhcmZpeFwifX0sIFxuICAgICAgICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb2wteHMtMTIgY29sLXNtLTRcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcImgyXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcInN0cm9uZ1wiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCIgMjAsN0sgXCJdfV19LCBcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwicFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJzbWFsbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJGb2xsb3dlcnNcIl19XX0sIFxuICAgICAgICAgICAgICAgICAge3RhZzogXCJidXR0b25cIiwgYXR0cnM6IHtjbGFzczpcImJ0biBidG4tc3VjY2VzcyBidG4tYmxvY2tcIn0sIGNoaWxkcmVuOiBbe3RhZzogXCJzcGFuXCIsIGF0dHJzOiB7Y2xhc3M6XCJmYSBmYS1wbHVzLWNpcmNsZVwifX0sIFwiIEZvbGxvdyBcIl19XG4gICAgICAgICAgICAgICAgXX0sIFxuXG4gICAgICAgICAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcImNvbC14cy0xMiBjb2wtc20tNFwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwiaDJcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3t0YWc6IFwic3Ryb25nXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFtcIjI0NVwiXX1dfSwgXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcInBcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3t0YWc6IFwic21hbGxcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW1wiRm9sbG93aW5nXCJdfV19LCBcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwiYnV0dG9uXCIsIGF0dHJzOiB7Y2xhc3M6XCJidG4gYnRuLWluZm8gYnRuLWJsb2NrXCJ9LCBjaGlsZHJlbjogW3t0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiZmEgZmEtdXNlclwifX0sIFwiIFZpZXcgUHJvZmlsZSBcIl19XG4gICAgICAgICAgICAgICAgXX0sIFxuXG4gICAgICAgICAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcImNvbC14cy0xMiBjb2wtc20tNFwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwiaDJcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3t0YWc6IFwic3Ryb25nXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFtcIjQzXCJdfV19LCBcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwicFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJzbWFsbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJTbmlwcGV0c1wiXX1dfSwgXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcImJ1dHRvblwiLCBhdHRyczoge3R5cGU6XCJidXR0b25cIiwgY2xhc3M6XCJidG4gYnRuLXByaW1hcnkgYnRuLWJsb2NrXCJ9LCBjaGlsZHJlbjogW3t0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiZmEgZmEtZ2VhclwifX0sIFwiIE9wdGlvbnMgXCJdfVxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgIF19XG4gICAgICAgICAgICBdfVxuICAgICAgICAgIF19XG4gICAgICAgIF19XG4gICAgICBdfVxuICAgIF19XG4gICk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9maWxlUGFnZTsiLCJ2YXIgTG9naW5QYWdlID0gcmVxdWlyZSgnLi9Mb2dpbi9sb2dpbi5qcycpO1xudmFyIFByb2ZpbGVQYWdlID0gcmVxdWlyZSgnLi9Qcm9maWxlL3Byb2ZpbGUuanMnKTtcbnZhciBQcm9maWxlS29ydmFpc1BhZ2UgPSByZXF1aXJlKCcuL1Byb2ZpbGUva29ydmFpcy5qcycpO1xuXG52YXIgQ3VycmVudFVzZXIgPSByZXF1aXJlKCcuL2NvbW1vbi9tb2RlbHMvY3VycmVudF91c2VyLmpzJyk7XG5cbnZhciBBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gIHJldHVybiB7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7IHJldHVybiBuZXcgQXV0aGVudGljYXRlZC5jb250cm9sbGVyKG1vZHVsZSk7IH0sXG4gICAgdmlldzogQXV0aGVudGljYXRlZC52aWV3XG4gIH07XG59O1xuXG5BdXRoZW50aWNhdGVkLmNvbnRyb2xsZXIgPSBmdW5jdGlvbihtb2R1bGUpIHtcbiAgaWYoIUN1cnJlbnRVc2VyLnVpZCgpKSBtLnJvdXRlKCcvbG9naW4nKTtcbiAgdGhpcy5jb250ZW50ID0gbW9kdWxlLnZpZXcuYmluZCh0aGlzLCBuZXcgbW9kdWxlLmNvbnRyb2xsZXIpO1xufTtcblxuQXV0aGVudGljYXRlZC52aWV3ID0gZnVuY3Rpb24oY3RybCkge1xuICByZXR1cm4gbShcIiNBdXRoZW50aWNhdGVkXCIsIGN0cmwuY29udGVudCgpKTtcbn07XG5cbi8vIGhlbHBlcnNcblxuU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQgPSBmdW5jdGlvbihudW0pIHtcbiAgcmV0dXJuIG5ldyBBcnJheShudW0gKyAxKS5qb2luKHRoaXMpO1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gZnVuY3Rpb24oZmluZCwgcmVwbGFjZSkge1xuICByZXR1cm4gdGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAoZmluZCwgJ2cnKSwgcmVwbGFjZSk7XG59O1xuXG5BcnJheS5wcm90b3R5cGUucmVtb3ZlRHVwbGljYXRlcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5yZWR1Y2UoZnVuY3Rpb24oYWNjdW0sIGN1cnJlbnQpIHtcbiAgICBpZihhY2N1bS5pbmRleE9mKGN1cnJlbnQpIDwgMCkgYWNjdW0ucHVzaChjdXJyZW50KTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH0sIFtdKTtcbn07XG5cbi8vIHJvdXRlc1xuXG5tLnJvdXRlLm1vZGUgPSAnaGFzaCc7XG5tLnJvdXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSwgJy9sb2dpbicsIHtcbiAgJy9sb2dpbic6IExvZ2luUGFnZSxcbiAgJy9rb3J2YWlzJzogQXV0aGVudGljYXRlZChQcm9maWxlS29ydmFpc1BhZ2UpLFxuICAnL21lJzogQXV0aGVudGljYXRlZChQcm9maWxlUGFnZSlcbn0pOyIsInZhciBDdXJyZW50VXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy9jdXJyZW50X3VzZXIuanMnKTtcblxudmFyIEhlYWRlciA9IHt9O1xuXG5IZWFkZXIuY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnVpZCA9IEN1cnJlbnRVc2VyLnVpZCgpO1xufTtcblxuSGVhZGVyLnZpZXcgPSBmdW5jdGlvbihjdHJsKSB7XG4gIHJldHVybiAoXG4gICAge3RhZzogXCJuYXZcIiwgYXR0cnM6IHtjbGFzczpcIm5hdmJhciBuYXZiYXItaW52ZXJzZSBuYXZiYXItZml4ZWQtdG9wXCIsIGlkOlwiSGVhZGVyXCJ9LCBjaGlsZHJlbjogW1xuICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcImNvbnRhaW5lci1mbHVpZFwifSwgY2hpbGRyZW46IFtcbiAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcIm5hdmJhci1oZWFkZXJcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAge3RhZzogXCJidXR0b25cIiwgYXR0cnM6IHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzOlwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIiwgXCJkYXRhLXRvZ2dsZVwiOlwiY29sbGFwc2VcIiwgXCJkYXRhLXRhcmdldFwiOlwiI25hdmJhclwiLCBcImFyaWEtZXhwYW5kZWRcIjpcImZhbHNlXCIsIFwiYXJpYS1jb250cm9sc1wiOlwibmF2YmFyXCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAge3RhZzogXCJzcGFuXCIsIGF0dHJzOiB7Y2xhc3M6XCJzci1vbmx5XCJ9LCBjaGlsZHJlbjogW1wiVG9nZ2xlIG5hdmlnYXRpb25cIl19LCBcbiAgICAgICAgICAgIHt0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiaWNvbi1iYXJcIn19LCBcbiAgICAgICAgICAgIHt0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiaWNvbi1iYXJcIn19LCBcbiAgICAgICAgICAgIHt0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiaWNvbi1iYXJcIn19XG4gICAgICAgICAgXX0sIFxuICAgICAgICAgIHt0YWc6IFwiYVwiLCBhdHRyczoge2NsYXNzOlwibmF2YmFyLWJyYW5kXCIsIGhyZWY6XCIjXCIsIGlkOlwibG9nb1wifSwgY2hpbGRyZW46IFtcIkNhcm5hdGljXCJdfVxuICAgICAgICBdfSwgXG5cbiAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtpZDpcIm5hdmJhclwiLCBjbGFzczpcIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICB7dGFnOiBcInVsXCIsIGF0dHJzOiB7Y2xhc3M6XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtocmVmOlwiI1wifSwgY2hpbGRyZW46IFtcIkRhc2hib2FyZFwiXX1dfSwgXG4gICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtocmVmOlwiI1wifSwgY2hpbGRyZW46IFtcIlNldHRpbmdzXCJdfV19LCBcbiAgICAgICAgICAgIHt0YWc6IFwibGlcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3t0YWc6IFwiYVwiLCBhdHRyczoge2hyZWY6XCIjXCJ9LCBjaGlsZHJlbjogW1wiUHJvZmlsZVwiXX1dfSwgXG4gICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtocmVmOlwiI1wifSwgY2hpbGRyZW46IFtcIkhlbHBcIl19XX0sIFxuICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge2NsYXNzOlwiZGl2aWRlclwifX0sIFxuICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJhXCIsIGF0dHJzOiB7aHJlZjpcIiMvbWVcIn0sIGNoaWxkcmVuOiBbY3RybC51aWRdfV19XG4gICAgICAgICAgXX1cbiAgICAgICAgXX1cbiAgICAgIF19XG4gICAgXX1cbiAgKTtcbn07XG5cbnZhciBBcHBMYXlvdXQgPSBmdW5jdGlvbih2aWV3KSB7XG4gIHJldHVybiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7aWQ6XCJBcHBMYXlvdXRcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgIEhlYWRlciwgXG4gICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb250YWluZXItZmx1aWRcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgdmlldyhjdHJsKVxuICAgICAgICBdfVxuICAgICAgXX1cbiAgICApO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBMYXlvdXQ7IiwidmFyIEN1cnJlbnRVc2VyID0gKGZ1bmN0aW9uKCl7XG4gIHZhciBsb2NhbFVzZXJEYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FybmF0aWMtY3VycmVudFVzZXInKSkgfHwge307XG5cbiAgcmV0dXJuIHtcbiAgICB1aWQ6IG0ucHJvcChsb2NhbFVzZXJEYXRhLnVpZCB8fCAnJyksXG4gICAgZW1haWw6IG0ucHJvcChsb2NhbFVzZXJEYXRhLmVtYWlsIHx8ICcnKVxuICB9O1xufSgpKTtcblxuQ3VycmVudFVzZXIucmVzZXQgPSBmdW5jdGlvbih1c2VyRGF0YSkge1xuICBDdXJyZW50VXNlci51aWQodXNlckRhdGEudWlkKTtcbiAgQ3VycmVudFVzZXIuZW1haWwodXNlckRhdGEuZW1haWwpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FybmF0aWMtY3VycmVudFVzZXInLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXJyZW50VXNlcjsiLCJ2YXIgS29ydmFpID0gZnVuY3Rpb24oZGF0YSkge1xuICB0aGlzLmNvbnRlbnQgPSBtLnByb3AoZGF0YS5jb250ZW50IHx8ICcnKTtcbiAgdGhpcy50aGFsYW0gPSBtLnByb3AoZGF0YS50aGFsYW0gfHwgMzIpO1xuICB0aGlzLm1hdHJhc0FmdGVyID0gbS5wcm9wKGRhdGEubWF0cmFzQWZ0ZXIgfHwgMCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtvcnZhaTsiLCJ2YXIgQ3VycmVudFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvY3VycmVudF91c2VyLmpzJyk7XG5cbnZhciBBdXRoU2VydmljZSA9IHtcbiAgbG9naW46IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCkge1xuICAgIHZhciByZWYgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL2Nhcm5hdGljLmZpcmViYXNlaW8uY29tL1wiKTtcbiAgICB2YXIgZGVmZXJyZWQgPSBtLmRlZmVycmVkKCk7XG4gICAgbS5zdGFydENvbXB1dGF0aW9uKCk7XG5cbiAgICByZWYuYXV0aFdpdGhQYXNzd29yZCh7XG4gICAgICBlbWFpbDogZW1haWwsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICB9LCBmdW5jdGlvbihlcnJvciwgYXV0aERhdGEpIHtcbiAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmlyZWJhc2UgbG9naW4gZmFpbGVkLCBlcnJvcjogXCIsIGVycm9yKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgbS5lbmRDb21wdXRhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJGaXJlYmFzZSBsb2dpbiBzdWNjZXNzZnVsLCBhdXRoRGF0YTogXCIsIGF1dGhEYXRhKTtcbiAgICAgICAgdmFyIHVzZXJEYXRhID0ge1xuICAgICAgICAgIHVpZDogYXV0aERhdGEudWlkLFxuICAgICAgICAgIGVtYWlsOiBhdXRoRGF0YS5wYXNzd29yZC5lbWFpbFxuICAgICAgICB9XG4gICAgICAgIEN1cnJlbnRVc2VyLnJlc2V0KHVzZXJEYXRhKTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh1c2VyRGF0YSk7XG4gICAgICAgIG0uZW5kQ29tcHV0YXRpb24oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGhTZXJ2aWNlOyJdfQ==
