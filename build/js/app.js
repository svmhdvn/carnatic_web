(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/siva/Documents/projects/carnatic_mithril/src/Followings/followings.js":[function(require,module,exports){
var API = require('../common/services/api_service.js');
var Profile = require('../common/models/profile.js');

var FollowersPage = {};
var FollowingsPage = {};

FollowersPage.controller = function() {
  this.followers = API('GET', '/users/' + m.route.param('user_id') + '/followers').then(function(followers) {
    return followers.map(function(f, index) {return new Profile(f.follower)});
  });
};

FollowingsPage.controller = function() {
  this.followings = API('GET', '/users/' + m.route.param('user_id') + '/followings').then(function(followings) {
    return followings.map(function(f, index) {return new Profile(f.followee)});
  });
};

var followingTemplate = function(f, index) {
  var userUrl = "#/users/" + f.user_id();

  return (
    {tag: "a", attrs: {href:userUrl}, children: [
      {tag: "div", attrs: {class:"panel panel-default"}, children: [
        {tag: "div", attrs: {class:"panel-body"}, children: [
          {tag: "img", attrs: {src:f.getSizedPicture(50)}}, "  ", 
          f.name()
        ]}
      ]}
    ]}
  );
};

FollowersPage.view = function(ctrl) {
  var followersList = ctrl.followers().map(followingTemplate);

  return (
    {tag: "div", attrs: {id:"Followers"}, children: [
      {tag: "h1", attrs: {}, children: ["My Followers"]}, {tag: "hr", attrs: {}}, 
      followersList
    ]}
  );
};

FollowingsPage.view = function(ctrl) {
  var followingsList = ctrl.followings().map(followingTemplate);

  return (
    {tag: "div", attrs: {id:"Followings"}, children: [
      {tag: "h1", attrs: {}, children: ["My Followings"]}, {tag: "hr", attrs: {}}, 
      followingsList
    ]}
  );
};

module.exports = {
  FollowersPage: FollowersPage,
  FollowingsPage: FollowingsPage
};
},{"../common/models/profile.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/profile.js","../common/services/api_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/api_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/Korvais/create_korvai.js":[function(require,module,exports){
var API = require('../common/services/api_service.js');
var Korvai = require('../common/models/korvai.js');
var KorvaiService = require('../common/services/korvai_service.js');
var CurrentUser = require('../common/models/current_user.js');

var CreateKorvaiPage = {};

CreateKorvaiPage.controller = function() {
  var vm = this;

  vm.korvai = new Korvai({});
  vm.korvaiPreview = m.prop('');

  vm.submit = function() {
    API('POST', '/korvais', {
      content: vm.korvai.content(),
      matras_after: vm.korvai.matras_after(),
      thalam: vm.korvai.thalam()
    }, CurrentUser.auth_token()).then(function(korvai) {
      toastr.success('Successfully created korvai!');
    }, function(error) {
      toastr.error('Error in creating korvai.');
    });
  };

  vm.preview = function() {
    vm.korvaiPreview(KorvaiService.toMsx(vm.korvai.content()));
  };
};

CreateKorvaiPage.view = function(ctrl) {
  autosize(document.getElementById('korvai-textarea'));

  return (
    {tag: "div", attrs: {id:"CreateKorvai"}, children: [
      {tag: "h1", attrs: {}, children: ["Create new korvai"]}, 
      {tag: "div", attrs: {class:"row"}, children: [
        {tag: "div", attrs: {class:"col-md-6"}, children: [
          {tag: "textarea", attrs: {
            required:true,
            class:"form-control", 
            rows:"10", 
            id:"korvai-textarea", 
            oninput:m.withAttr("value", ctrl.korvai.content)}}
        ]}, 

        {tag: "div", attrs: {class:"col-md-6"}, children: [
          {tag: "div", attrs: {class:"well korvai-content", id:"preview-container"}, children: [ctrl.korvaiPreview()]}
        ]}
      ]}, {tag: "br", attrs: {}}, 
      
      {tag: "button", attrs: {class:"btn btn-large btn-danger", onclick:ctrl.submit}, children: ["Submit"]}, 
      {tag: "button", attrs: {class:"btn btn-large btn-warning", onclick:ctrl.preview}, children: ["Preview"]}
    ]}
  );
};

module.exports = CreateKorvaiPage;
},{"../common/models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js","../common/models/korvai.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/korvai.js","../common/services/api_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/api_service.js","../common/services/korvai_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/korvai_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/Korvais/korvai_detail.js":[function(require,module,exports){
var API = require('../common/services/api_service.js');
var Korvai = require('../common/models/korvai.js');
var KorvaiService = require('../common/services/korvai_service.js');

var KorvaiDetailPage = {};

KorvaiDetailPage.controller = function() {
  var vm = this;

  API('GET', '/korvais/' + m.route.param('korvai_id')).then(function(korvaiData) {
    vm.korvai = new Korvai(korvaiData);
    vm.formattedMatraCount = KorvaiService.formatMatraCount(vm.korvai.content(), vm.korvai.thalam());
  });
};

KorvaiDetailPage.view = function(ctrl) {
  var korvaiHtml = KorvaiService.toMsx(ctrl.korvai.content());

  return (
    {tag: "div", attrs: {id:"KorvaiDetail"}, children: [
      {tag: "h1", attrs: {}, children: ["Korvai #", ctrl.korvai.id(), " ", {tag: "small", attrs: {}, children: ["(", ctrl.formattedMatraCount, ")"]}]}, {tag: "hr", attrs: {}}, 
      korvaiHtml
    ]}
  );
};

module.exports = KorvaiDetailPage;
},{"../common/models/korvai.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/korvai.js","../common/services/api_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/api_service.js","../common/services/korvai_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/korvai_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/Korvais/korvai_list.js":[function(require,module,exports){
var CurrentUser = require('../common/models/current_user.js');

var ProfileKorvaisPage = {};

ProfileKorvaisPage.controller = function() {
  this.korvais = CurrentUser.korvais();
};

ProfileKorvaisPage.view = function(ctrl) {
  var korvais = ctrl.korvais().map(function(korvai, index) {
    var title = "Thalam: " + korvai.thalam() + ", Matras after: " + korvai.matras_after();
    var korvaiUrl = "#/korvais/" + korvai.id();

    return (
      {tag: "a", attrs: {href:korvaiUrl}, children: [
        {tag: "div", attrs: {class:"panel panel-primary"}, children: [
          {tag: "div", attrs: {class:"panel-heading"}, children: [
            {tag: "h3", attrs: {class:"panel-title"}, children: [title]}
          ]}, 
          {tag: "div", attrs: {class:"panel-body"}, children: [
            korvai.content()
          ]}
        ]}
      ]}
    );
  });

  return (
    {tag: "div", attrs: {id:"ProfileKorvais"}, children: [
      {tag: "h1", attrs: {}, children: ["Korvais View"]}, {tag: "br", attrs: {}}, 
      korvais, " ", {tag: "hr", attrs: {}}, 

      {tag: "a", attrs: {href:"#/korvais/new", class:"btn btn-danger btn-large"}, children: ["Create korvai"]}
    ]}
  );
};

module.exports = ProfileKorvaisPage;
},{"../common/models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/Profile/profile_view.js":[function(require,module,exports){
var CurrentUser = require('../common/models/current_user.js');
var API = require('../common/services/api_service.js');
var Profile = require('../common/models/profile.js');

var ProfilePage = {};

ProfilePage.controller = function() {
  var vm = this;

  var paramUserId = m.route.param('user_id');
  if(paramUserId == CurrentUser.id()) {
    vm.profile = CurrentUser.profile();
    vm.hideFollowButton = true;
  } else {
    API('GET', '/users/' + m.route.param('user_id') + '/profile').then(function(profileData) {
      vm.profile = m.prop(new Profile(profileData));
      vm.hideFollowButton = false;
    });
  }

  vm.followers = API('GET', '/users/' + paramUserId + '/followers').then(function(followers) {
    return followers.map(function(f, index) {return new Profile(f)});
  });

  vm.followings = API('GET', '/users/' + paramUserId + '/followings').then(function(followings) {
    return followings.map(function(f, index) {return new Profile(f)});
  });

  var currentUrl = m.route();
  vm.followersRoute = function() {
    m.route(currentUrl + "/followers");
  };
  vm.followingRoute = function() {
    m.route(currentUrl + "/following");
  };

  vm.follow = function() {
    
  };
};

ProfilePage.view = function(ctrl) {return (
    {tag: "div", attrs: {class:"container", id:"Profile"}, children: [
      {tag: "div", attrs: {class:"row"}, children: [
        {tag: "div", attrs: {class:"col-md-8 col-xs-10"}, children: [
          {tag: "div", attrs: {class:"well panel panel-default"}, children: [
            {tag: "div", attrs: {class:"panel-body"}, children: [
              {tag: "div", attrs: {class:"row"}, children: [
                {tag: "div", attrs: {class:"col-xs-12 col-sm-4 text-center"}, children: [
                  {tag: "img", attrs: {
                    src:ctrl.profile().getSizedPicture(200), 
                    alt:"Profile picture", 
                    class:"center-block img-circle img-thumbnail img-responsive", 
                    height:"200", 
                    width:"200"}}, 

                  {tag: "ul", attrs: {class:"list-inline ratings text-center", title:"Ratings"}, children: [
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}, 
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}, 
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}, 
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}, 
                    {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "span", attrs: {class:"fa fa-star fa-lg"}}]}]}
                  ]}
                ]}, 

                {tag: "div", attrs: {class:"col-xs-12 col-sm-8"}, children: [
                  {tag: "h2", attrs: {}, children: [ctrl.profile().name()]}, 
                  {tag: "p", attrs: {}, children: [{tag: "strong", attrs: {}, children: ["About: "]}, " Web Designer / UI Expert. "]}, 
                  {tag: "p", attrs: {}, children: [{tag: "strong", attrs: {}, children: ["Hobbies: "]}, " Read, out with friends, listen to music, draw and learn new things. "]}, 
                  {tag: "button", attrs: {class:"btn btn-warning", onclick:ctrl.follow, disabled:ctrl.hideFollowButton}, children: [ctrl.hideFollowButton ? "Already" : "Follow"]}
                ]}, 

                {tag: "div", attrs: {class:"clearfix"}}, 
                {tag: "div", attrs: {class:"col-xs-12 col-sm-4"}, children: [
                  {tag: "h2", attrs: {}, children: [{tag: "strong", attrs: {}, children: [ctrl.followers().length]}]}, 
                  {tag: "p", attrs: {}, children: [{tag: "small", attrs: {}, children: ["Followers"]}]}, 
                  {tag: "button", attrs: {class:"btn btn-success btn-block", onclick:ctrl.followersRoute}, children: [{tag: "span", attrs: {class:"fa fa-plus-circle"}}, "View Followers"]}
                ]}, 

                {tag: "div", attrs: {class:"col-xs-12 col-sm-4"}, children: [
                  {tag: "h2", attrs: {}, children: [{tag: "strong", attrs: {}, children: [ctrl.followings().length]}]}, 
                  {tag: "p", attrs: {}, children: [{tag: "small", attrs: {}, children: ["Following"]}]}, 
                  {tag: "button", attrs: {class:"btn btn-info btn-block", onclick:ctrl.followingRoute}, children: [{tag: "span", attrs: {class:"fa fa-user"}}, "View Following"]}
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
};

module.exports = ProfilePage;
},{"../common/models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js","../common/models/profile.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/profile.js","../common/services/api_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/api_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/app.js":[function(require,module,exports){
var ProfilePage = require('./Profile/profile_view.js');
var ProfileKorvaisPage = require('./Korvais/korvai_list.js');

var _followingsPages = require('./Followings/followings.js');

var FollowersPage = _followingsPages.FollowersPage;
var FollowingsPage = _followingsPages.FollowingsPage;

var KorvaiDetailPage = require('./Korvais/korvai_detail.js');
var CreateKorvaiPage = require('./Korvais/create_korvai.js');

var CurrentUser = require('./common/models/current_user.js');

// Header Layout

var Header = {};

Header.controller = function() {
  if(!CurrentUser.id()) window.location.replace("/#/login");
  else {
    this.profile = CurrentUser.profile();

    this.logout = function(e) {
      e.preventDefault();
      CurrentUser.clear();
      window.location.replace("/");
    };
  }
};

Header.view = function(ctrl) {
  var myProfileLink = '#/users/' + CurrentUser.id();

  return (
    {tag: "nav", attrs: {class:"navbar navbar-inverse navbar-fixed-top", id:"Header"}, children: [
      {tag: "div", attrs: {class:"container-fluid"}, children: [
        {tag: "div", attrs: {class:"navbar-header"}, children: [
          {tag: "a", attrs: {class:"navbar-brand", href:"#", id:"logo"}, children: ["Carnatic"]}
        ]}, 

        {tag: "div", attrs: {id:"navbar", class:"navbar-collapse collapse"}, children: [
          {tag: "ul", attrs: {class:"nav navbar-nav navbar-right"}, children: [
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#/korvais/new"}, children: ["New Korvai"]}]}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#/korvais"}, children: ["Korvais"]}]}, 
            {tag: "li", attrs: {class:"divider"}}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:myProfileLink}, children: [
              {tag: "img", attrs: {src:ctrl.profile().getSizedPicture(20)}}, "  ", 
              ctrl.profile().name()
            ]}]}, 
            {tag: "li", attrs: {class:"divider"}}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {onclick:ctrl.logout, href:""}, children: ["Logout"]}]}
          ]}
        ]}
      ]}
    ]}
  );
};

m.mount(document.getElementById('HeaderContainer'), Header);

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

// options and configuration

toastr.options = {
  "newestOnTop": true,
  "positionClass": "toast-bottom-full-width"
};

// routes

m.route.mode = 'hash';
m.route(document.getElementById('AppContainer'), '/korvais', {
  '/korvais': ProfileKorvaisPage,
  '/korvais/:korvai_id': KorvaiDetailPage,
  '/korvais/new': CreateKorvaiPage,

  '/users/:user_id': ProfilePage,
  '/users/:user_id/followers': FollowersPage,
  '/users/:user_id/following': FollowingsPage
});
},{"./Followings/followings.js":"/home/siva/Documents/projects/carnatic_mithril/src/Followings/followings.js","./Korvais/create_korvai.js":"/home/siva/Documents/projects/carnatic_mithril/src/Korvais/create_korvai.js","./Korvais/korvai_detail.js":"/home/siva/Documents/projects/carnatic_mithril/src/Korvais/korvai_detail.js","./Korvais/korvai_list.js":"/home/siva/Documents/projects/carnatic_mithril/src/Korvais/korvai_list.js","./Profile/profile_view.js":"/home/siva/Documents/projects/carnatic_mithril/src/Profile/profile_view.js","./common/models/current_user.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/common/models/current_user.js":[function(require,module,exports){
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
},{}],"/home/siva/Documents/projects/carnatic_mithril/src/common/services/korvai_service.js":[function(require,module,exports){
var MatrasService = require('./matras_service.js');

var KorvaiService = {
  toMsx: function(korvai) {
    var korvaiWords = this.addWhitespace(korvai).match(/([a-zA-z\(\)\[\]\n]+|\/[0-9]+)/g);
    return {tag: "div", attrs: {class:"korvai-content"}, children: [this.formatWords(korvaiWords)]};
  },

  formatMatraCount: function(korvai, thalam) {
    var totalMatras = this.countMatras(korvai);

    var avarthanams = Math.floor(totalMatras / thalam);
    var avarthanamsPhrase = avarthanams.toString() + " avarthanam" + (avarthanams !== 1 ? "s" : "") + ", ";

    var matrasRemaining = totalMatras % thalam;
    var matrasPhrase = matrasRemaining + " matra" + (matrasRemaining !== 1 ? "s" : "");

    return avarthanamsPhrase + matrasPhrase;
  },

  countMatras: function(korvai) {
    return MatrasService.countMatras(korvai, true);
  },

  // -------- PRIVATE --------

  formatWords: function(wordList, modifierOpeningBracket) {
    var children = [];
    // if formatWords is called on a repeater or a nadai enclosed in brackets
    if(modifierOpeningBracket) {
      children.push({tag: "span", attrs: {class:"modifier-bracket"}, children: [modifierOpeningBracket, " "]});
    }

    // only go to the 2nd last element because the last one contains the number for modification
    for(var i = 0; i < wordList.length - (modifierOpeningBracket ? 1 : 0); i++) {
      var word = wordList[i];
      var openingBracket = this.openingBracket(word);

      // if there's an opening bracket, then a modifier begins
      if(openingBracket) {
        var j = i;
        var brackets = 0;

        while(j < wordList.length) {
          word = wordList[++j];
          if(this.openingBracket(word)) brackets++;
          else if(this.closingBracket(word) && !brackets) break;
          else if(this.closingBracket(word)) brackets--;
        }

        if(j == wordList.length) {
          console.error('invalid korvai');
        } else {
          var modified = wordList.slice(i+1, j);
          children.push(this.formatWords(modified, openingBracket));
          i = j;
        }
      } else if(word == "\n") {
        children.push({tag: "br", attrs: {}});
      } else {
        children.push({tag: "span", attrs: {}, children: [word, {tag: "sup", attrs: {}, children: [this.countMatras(word)]}, " "]});
      }
    }

    // close the bracket if formatWords was called with an enclosed modifier
    if(modifierOpeningBracket) {
      children.push({tag: "span", attrs: {class:"modifier-bracket"}, children: [" ", (modifierOpeningBracket == '(' ? ')' : ']')]});
      if(modifierOpeningBracket == '(') {
        children.push(" × " + wordList[i].substring(1));
      } else {
        children.push(" → " + this.numberToNadai(parseInt(wordList[i].substring(1))));
      }
    }

    return children;
  },

  // adds spaces between all the misc. characters and whitespace
  addWhitespace: function(korvai) {
    return korvai.replace(/([,;\(\)\[\]\n]|\/[0-9]+)/g, ' $1 ');
  },

  openingBracket: function(str) {
    return (str == '(' || str == '[' ? str : false);
  },

  closingBracket: function(str) {
    return (str == ')' || str == ']' ? str : false);
  },

  numberToNadai: function(num) {
    switch(num) {
      case 3:
        return "thisram";
      case 4:
        return "chatusram";
      case 5:
        return "kandam";
      case 6:
        return "mael thisram";
      case 7:
        return "misram";
      case 8:
        return "mael chatusram";
      case 9:
        return "sankeernam";
    }
  }
};

module.exports = KorvaiService;
},{"./matras_service.js":"/home/siva/Documents/projects/carnatic_mithril/src/common/services/matras_service.js"}],"/home/siva/Documents/projects/carnatic_mithril/src/common/services/matras_service.js":[function(require,module,exports){
var MatrasService = {
  // countMatras(korvai) counts the number of matras in the korvai
  // TODO: this only works for 2nd speed
  countMatras: function(korvai, hasNadais) {
    var div = document.createElement("div");
    div.innerHTML = korvai;
    korvai = div.textContent || div.innerText || '';

    var matras = 0;

    if(hasNadais) {
      var nadais = this.findModifiers(korvai, "[", "]");

      for(var i = 0; i < nadais.length; i++) {
        var n = nadais[i];
        matras += this.nadaiMatras(n);
        korvai = korvai.replace("[" + n + "]", '');
      }
    }

    var repeaters = this.findModifiers(korvai, "(", ")");

    for(var i = 0; i < repeaters.length; i++) {
      var r = repeaters[i];
      matras += this.repeaterMatras(r);
      korvai = korvai.replace("(" + r + ")", '');
    }

    matras += this.matrasWithoutModifiers(korvai);
    return matras;
  },

  // -------- PRIVATE --------
  
  // findModifiers(str, oBracket, cBracket) produces an array of all the
  // content of the "modifiers" in the given korvai string, where a modifier
  // is either a repeater or nadai
  // a repeater is of the form "(thathinkinathom /3)" with parentheses
  // a nadai is of the form "[thathinkinathom /3]" with square brackets
  // TODO: clean this up, it's very messy
  findModifiers: function(str, oBracket, cBracket) {
    var endPos = -1;
    var modifiers = [];

    while(true) {
      while(str.charAt(endPos + 1) != oBracket && endPos < str.length) endPos++;
      if(endPos == str.length) break;

      var openBrackets = 0;
      var startPos = endPos;

      while(true) {
        chr = str.charAt(++endPos);

        if(chr == oBracket) openBrackets++;
        else if(chr == cBracket) openBrackets--;

        if(!(openBrackets > 0 && endPos < str.length)) break;
      }

      if(endPos == str.length) break;

      modifiers.push(str.substring(startPos + 2, endPos));
    }

    return modifiers;
  },

  // repeatString(r) consumes a repeater (as defined above)
  // and produces the repeated sequence as a string (or false if not found)
  // e.g. (thathinkinathom /3) produces "thathinkinathom thathinkinathom thathinkinathom "
  repeatString: function(r) {
    var lastSlash = r.lastIndexOf("/");
    if(lastSlash == -1) return false;

    var rString = r.substring(0, lastSlash);
    var repeaters = this.findModifiers(rString, "(", ")");

    for(var i = 0; i < repeaters.length; i++)
      rString = this.replaceRepeater(rString, repeaters[i]);

    var numOfRepeats = parseInt(r.slice(lastSlash + 1));

    try {
      return rString.repeat(numOfRepeats);
    } catch(error) {
      console.error("ERROR: Invalid repeater syntax: ", error);
      return rString;
    }
  },

  // replaceRepeater(str, r) replaces the occurrences of the repeater
  // in the given string
  replaceRepeater: function(str, r) {
    return str.replace("(" + r + ")", this.repeatString(r));
  },

  // repeaterMatras(r) counts the number of matras in the given repeater
  repeaterMatras: function(r) {
    return this.matrasWithoutModifiers(this.repeatString(r));
  },

  nadaiMatras: function(n) {
    var lastSlash = n.lastIndexOf("/");
    if(lastSlash == -1) return;

    var nString = n.substring(0, lastSlash);

    return this.countMatras(nString, false) * 4 / parseInt(n.slice(lastSlash + 1));
  },

  wordMatras: function(word) {
    var vowels = word.match(/[aeiou]/g);
    if(vowels) return vowels.length;
    else return 0;
  },

  matrasWithoutModifiers: function(korvai) {
    var matras = 0;
    var korvaiWords = korvai.replace(/(\r\n|\n|\r)/gm, ' ').split(' ');

    for(var i = 0; i < korvaiWords.length; i++)
      matras += this.wordMatras(korvaiWords[i]);

    var commas = korvai.match(/,/g);
    matras += (commas ? commas.length : 0);

    var semicolons = korvai.match(/;/g);
    matras += (semicolons ? semicolons.length * 2 : 0);

    return matras;
  }
};

module.exports = MatrasService;
},{}]},{},["/home/siva/Documents/projects/carnatic_mithril/src/app.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvRm9sbG93aW5ncy9mb2xsb3dpbmdzLmpzIiwic3JjL0tvcnZhaXMvY3JlYXRlX2tvcnZhaS5qcyIsInNyYy9Lb3J2YWlzL2tvcnZhaV9kZXRhaWwuanMiLCJzcmMvS29ydmFpcy9rb3J2YWlfbGlzdC5qcyIsInNyYy9Qcm9maWxlL3Byb2ZpbGVfdmlldy5qcyIsInNyYy9hcHAuanMiLCJzcmMvY29tbW9uL21vZGVscy9jdXJyZW50X3VzZXIuanMiLCJzcmMvY29tbW9uL21vZGVscy9rb3J2YWkuanMiLCJzcmMvY29tbW9uL21vZGVscy9wcm9maWxlLmpzIiwic3JjL2NvbW1vbi9zZXJ2aWNlcy9hcGlfc2VydmljZS5qcyIsInNyYy9jb21tb24vc2VydmljZXMva29ydmFpX3NlcnZpY2UuanMiLCJzcmMvY29tbW9uL3NlcnZpY2VzL21hdHJhc19zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBBUEkgPSByZXF1aXJlKCcuLi9jb21tb24vc2VydmljZXMvYXBpX3NlcnZpY2UuanMnKTtcbnZhciBQcm9maWxlID0gcmVxdWlyZSgnLi4vY29tbW9uL21vZGVscy9wcm9maWxlLmpzJyk7XG5cbnZhciBGb2xsb3dlcnNQYWdlID0ge307XG52YXIgRm9sbG93aW5nc1BhZ2UgPSB7fTtcblxuRm9sbG93ZXJzUGFnZS5jb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZm9sbG93ZXJzID0gQVBJKCdHRVQnLCAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCd1c2VyX2lkJykgKyAnL2ZvbGxvd2VycycpLnRoZW4oZnVuY3Rpb24oZm9sbG93ZXJzKSB7XG4gICAgcmV0dXJuIGZvbGxvd2Vycy5tYXAoZnVuY3Rpb24oZiwgaW5kZXgpIHtyZXR1cm4gbmV3IFByb2ZpbGUoZi5mb2xsb3dlcil9KTtcbiAgfSk7XG59O1xuXG5Gb2xsb3dpbmdzUGFnZS5jb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZm9sbG93aW5ncyA9IEFQSSgnR0VUJywgJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgndXNlcl9pZCcpICsgJy9mb2xsb3dpbmdzJykudGhlbihmdW5jdGlvbihmb2xsb3dpbmdzKSB7XG4gICAgcmV0dXJuIGZvbGxvd2luZ3MubWFwKGZ1bmN0aW9uKGYsIGluZGV4KSB7cmV0dXJuIG5ldyBQcm9maWxlKGYuZm9sbG93ZWUpfSk7XG4gIH0pO1xufTtcblxudmFyIGZvbGxvd2luZ1RlbXBsYXRlID0gZnVuY3Rpb24oZiwgaW5kZXgpIHtcbiAgdmFyIHVzZXJVcmwgPSBcIiMvdXNlcnMvXCIgKyBmLnVzZXJfaWQoKTtcblxuICByZXR1cm4gKFxuICAgIHt0YWc6IFwiYVwiLCBhdHRyczoge2hyZWY6dXNlclVybH0sIGNoaWxkcmVuOiBbXG4gICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwicGFuZWwgcGFuZWwtZGVmYXVsdFwifSwgY2hpbGRyZW46IFtcbiAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcInBhbmVsLWJvZHlcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAge3RhZzogXCJpbWdcIiwgYXR0cnM6IHtzcmM6Zi5nZXRTaXplZFBpY3R1cmUoNTApfX0sIFwiwqDCoFwiLCBcbiAgICAgICAgICBmLm5hbWUoKVxuICAgICAgICBdfVxuICAgICAgXX1cbiAgICBdfVxuICApO1xufTtcblxuRm9sbG93ZXJzUGFnZS52aWV3ID0gZnVuY3Rpb24oY3RybCkge1xuICB2YXIgZm9sbG93ZXJzTGlzdCA9IGN0cmwuZm9sbG93ZXJzKCkubWFwKGZvbGxvd2luZ1RlbXBsYXRlKTtcblxuICByZXR1cm4gKFxuICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7aWQ6XCJGb2xsb3dlcnNcIn0sIGNoaWxkcmVuOiBbXG4gICAgICB7dGFnOiBcImgxXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFtcIk15IEZvbGxvd2Vyc1wiXX0sIHt0YWc6IFwiaHJcIiwgYXR0cnM6IHt9fSwgXG4gICAgICBmb2xsb3dlcnNMaXN0XG4gICAgXX1cbiAgKTtcbn07XG5cbkZvbGxvd2luZ3NQYWdlLnZpZXcgPSBmdW5jdGlvbihjdHJsKSB7XG4gIHZhciBmb2xsb3dpbmdzTGlzdCA9IGN0cmwuZm9sbG93aW5ncygpLm1hcChmb2xsb3dpbmdUZW1wbGF0ZSk7XG5cbiAgcmV0dXJuIChcbiAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2lkOlwiRm9sbG93aW5nc1wifSwgY2hpbGRyZW46IFtcbiAgICAgIHt0YWc6IFwiaDFcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW1wiTXkgRm9sbG93aW5nc1wiXX0sIHt0YWc6IFwiaHJcIiwgYXR0cnM6IHt9fSwgXG4gICAgICBmb2xsb3dpbmdzTGlzdFxuICAgIF19XG4gICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRm9sbG93ZXJzUGFnZTogRm9sbG93ZXJzUGFnZSxcbiAgRm9sbG93aW5nc1BhZ2U6IEZvbGxvd2luZ3NQYWdlXG59OyIsInZhciBBUEkgPSByZXF1aXJlKCcuLi9jb21tb24vc2VydmljZXMvYXBpX3NlcnZpY2UuanMnKTtcbnZhciBLb3J2YWkgPSByZXF1aXJlKCcuLi9jb21tb24vbW9kZWxzL2tvcnZhaS5qcycpO1xudmFyIEtvcnZhaVNlcnZpY2UgPSByZXF1aXJlKCcuLi9jb21tb24vc2VydmljZXMva29ydmFpX3NlcnZpY2UuanMnKTtcbnZhciBDdXJyZW50VXNlciA9IHJlcXVpcmUoJy4uL2NvbW1vbi9tb2RlbHMvY3VycmVudF91c2VyLmpzJyk7XG5cbnZhciBDcmVhdGVLb3J2YWlQYWdlID0ge307XG5cbkNyZWF0ZUtvcnZhaVBhZ2UuY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdm0gPSB0aGlzO1xuXG4gIHZtLmtvcnZhaSA9IG5ldyBLb3J2YWkoe30pO1xuICB2bS5rb3J2YWlQcmV2aWV3ID0gbS5wcm9wKCcnKTtcblxuICB2bS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICBBUEkoJ1BPU1QnLCAnL2tvcnZhaXMnLCB7XG4gICAgICBjb250ZW50OiB2bS5rb3J2YWkuY29udGVudCgpLFxuICAgICAgbWF0cmFzX2FmdGVyOiB2bS5rb3J2YWkubWF0cmFzX2FmdGVyKCksXG4gICAgICB0aGFsYW06IHZtLmtvcnZhaS50aGFsYW0oKVxuICAgIH0sIEN1cnJlbnRVc2VyLmF1dGhfdG9rZW4oKSkudGhlbihmdW5jdGlvbihrb3J2YWkpIHtcbiAgICAgIHRvYXN0ci5zdWNjZXNzKCdTdWNjZXNzZnVsbHkgY3JlYXRlZCBrb3J2YWkhJyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIHRvYXN0ci5lcnJvcignRXJyb3IgaW4gY3JlYXRpbmcga29ydmFpLicpO1xuICAgIH0pO1xuICB9O1xuXG4gIHZtLnByZXZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2bS5rb3J2YWlQcmV2aWV3KEtvcnZhaVNlcnZpY2UudG9Nc3godm0ua29ydmFpLmNvbnRlbnQoKSkpO1xuICB9O1xufTtcblxuQ3JlYXRlS29ydmFpUGFnZS52aWV3ID0gZnVuY3Rpb24oY3RybCkge1xuICBhdXRvc2l6ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna29ydmFpLXRleHRhcmVhJykpO1xuXG4gIHJldHVybiAoXG4gICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtpZDpcIkNyZWF0ZUtvcnZhaVwifSwgY2hpbGRyZW46IFtcbiAgICAgIHt0YWc6IFwiaDFcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW1wiQ3JlYXRlIG5ldyBrb3J2YWlcIl19LCBcbiAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJyb3dcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb2wtbWQtNlwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICB7dGFnOiBcInRleHRhcmVhXCIsIGF0dHJzOiB7XG4gICAgICAgICAgICByZXF1aXJlZDp0cnVlLFxuICAgICAgICAgICAgY2xhc3M6XCJmb3JtLWNvbnRyb2xcIiwgXG4gICAgICAgICAgICByb3dzOlwiMTBcIiwgXG4gICAgICAgICAgICBpZDpcImtvcnZhaS10ZXh0YXJlYVwiLCBcbiAgICAgICAgICAgIG9uaW5wdXQ6bS53aXRoQXR0cihcInZhbHVlXCIsIGN0cmwua29ydmFpLmNvbnRlbnQpfX1cbiAgICAgICAgXX0sIFxuXG4gICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb2wtbWQtNlwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwid2VsbCBrb3J2YWktY29udGVudFwiLCBpZDpcInByZXZpZXctY29udGFpbmVyXCJ9LCBjaGlsZHJlbjogW2N0cmwua29ydmFpUHJldmlldygpXX1cbiAgICAgICAgXX1cbiAgICAgIF19LCB7dGFnOiBcImJyXCIsIGF0dHJzOiB7fX0sIFxuICAgICAgXG4gICAgICB7dGFnOiBcImJ1dHRvblwiLCBhdHRyczoge2NsYXNzOlwiYnRuIGJ0bi1sYXJnZSBidG4tZGFuZ2VyXCIsIG9uY2xpY2s6Y3RybC5zdWJtaXR9LCBjaGlsZHJlbjogW1wiU3VibWl0XCJdfSwgXG4gICAgICB7dGFnOiBcImJ1dHRvblwiLCBhdHRyczoge2NsYXNzOlwiYnRuIGJ0bi1sYXJnZSBidG4td2FybmluZ1wiLCBvbmNsaWNrOmN0cmwucHJldmlld30sIGNoaWxkcmVuOiBbXCJQcmV2aWV3XCJdfVxuICAgIF19XG4gICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENyZWF0ZUtvcnZhaVBhZ2U7IiwidmFyIEFQSSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9zZXJ2aWNlcy9hcGlfc2VydmljZS5qcycpO1xudmFyIEtvcnZhaSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9tb2RlbHMva29ydmFpLmpzJyk7XG52YXIgS29ydmFpU2VydmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9zZXJ2aWNlcy9rb3J2YWlfc2VydmljZS5qcycpO1xuXG52YXIgS29ydmFpRGV0YWlsUGFnZSA9IHt9O1xuXG5Lb3J2YWlEZXRhaWxQYWdlLmNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHZtID0gdGhpcztcblxuICBBUEkoJ0dFVCcsICcva29ydmFpcy8nICsgbS5yb3V0ZS5wYXJhbSgna29ydmFpX2lkJykpLnRoZW4oZnVuY3Rpb24oa29ydmFpRGF0YSkge1xuICAgIHZtLmtvcnZhaSA9IG5ldyBLb3J2YWkoa29ydmFpRGF0YSk7XG4gICAgdm0uZm9ybWF0dGVkTWF0cmFDb3VudCA9IEtvcnZhaVNlcnZpY2UuZm9ybWF0TWF0cmFDb3VudCh2bS5rb3J2YWkuY29udGVudCgpLCB2bS5rb3J2YWkudGhhbGFtKCkpO1xuICB9KTtcbn07XG5cbktvcnZhaURldGFpbFBhZ2UudmlldyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgdmFyIGtvcnZhaUh0bWwgPSBLb3J2YWlTZXJ2aWNlLnRvTXN4KGN0cmwua29ydmFpLmNvbnRlbnQoKSk7XG5cbiAgcmV0dXJuIChcbiAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2lkOlwiS29ydmFpRGV0YWlsXCJ9LCBjaGlsZHJlbjogW1xuICAgICAge3RhZzogXCJoMVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJLb3J2YWkgI1wiLCBjdHJsLmtvcnZhaS5pZCgpLCBcIiBcIiwge3RhZzogXCJzbWFsbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCIoXCIsIGN0cmwuZm9ybWF0dGVkTWF0cmFDb3VudCwgXCIpXCJdfV19LCB7dGFnOiBcImhyXCIsIGF0dHJzOiB7fX0sIFxuICAgICAga29ydmFpSHRtbFxuICAgIF19XG4gICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtvcnZhaURldGFpbFBhZ2U7IiwidmFyIEN1cnJlbnRVc2VyID0gcmVxdWlyZSgnLi4vY29tbW9uL21vZGVscy9jdXJyZW50X3VzZXIuanMnKTtcblxudmFyIFByb2ZpbGVLb3J2YWlzUGFnZSA9IHt9O1xuXG5Qcm9maWxlS29ydmFpc1BhZ2UuY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmtvcnZhaXMgPSBDdXJyZW50VXNlci5rb3J2YWlzKCk7XG59O1xuXG5Qcm9maWxlS29ydmFpc1BhZ2UudmlldyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgdmFyIGtvcnZhaXMgPSBjdHJsLmtvcnZhaXMoKS5tYXAoZnVuY3Rpb24oa29ydmFpLCBpbmRleCkge1xuICAgIHZhciB0aXRsZSA9IFwiVGhhbGFtOiBcIiArIGtvcnZhaS50aGFsYW0oKSArIFwiLCBNYXRyYXMgYWZ0ZXI6IFwiICsga29ydmFpLm1hdHJhc19hZnRlcigpO1xuICAgIHZhciBrb3J2YWlVcmwgPSBcIiMva29ydmFpcy9cIiArIGtvcnZhaS5pZCgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIHt0YWc6IFwiYVwiLCBhdHRyczoge2hyZWY6a29ydmFpVXJsfSwgY2hpbGRyZW46IFtcbiAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcInBhbmVsIHBhbmVsLXByaW1hcnlcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcInBhbmVsLWhlYWRpbmdcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7dGFnOiBcImgzXCIsIGF0dHJzOiB7Y2xhc3M6XCJwYW5lbC10aXRsZVwifSwgY2hpbGRyZW46IFt0aXRsZV19XG4gICAgICAgICAgXX0sIFxuICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJwYW5lbC1ib2R5XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAga29ydmFpLmNvbnRlbnQoKVxuICAgICAgICAgIF19XG4gICAgICAgIF19XG4gICAgICBdfVxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtpZDpcIlByb2ZpbGVLb3J2YWlzXCJ9LCBjaGlsZHJlbjogW1xuICAgICAge3RhZzogXCJoMVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJLb3J2YWlzIFZpZXdcIl19LCB7dGFnOiBcImJyXCIsIGF0dHJzOiB7fX0sIFxuICAgICAga29ydmFpcywgXCIgXCIsIHt0YWc6IFwiaHJcIiwgYXR0cnM6IHt9fSwgXG5cbiAgICAgIHt0YWc6IFwiYVwiLCBhdHRyczoge2hyZWY6XCIjL2tvcnZhaXMvbmV3XCIsIGNsYXNzOlwiYnRuIGJ0bi1kYW5nZXIgYnRuLWxhcmdlXCJ9LCBjaGlsZHJlbjogW1wiQ3JlYXRlIGtvcnZhaVwiXX1cbiAgICBdfVxuICApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9maWxlS29ydmFpc1BhZ2U7IiwidmFyIEN1cnJlbnRVc2VyID0gcmVxdWlyZSgnLi4vY29tbW9uL21vZGVscy9jdXJyZW50X3VzZXIuanMnKTtcbnZhciBBUEkgPSByZXF1aXJlKCcuLi9jb21tb24vc2VydmljZXMvYXBpX3NlcnZpY2UuanMnKTtcbnZhciBQcm9maWxlID0gcmVxdWlyZSgnLi4vY29tbW9uL21vZGVscy9wcm9maWxlLmpzJyk7XG5cbnZhciBQcm9maWxlUGFnZSA9IHt9O1xuXG5Qcm9maWxlUGFnZS5jb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciB2bSA9IHRoaXM7XG5cbiAgdmFyIHBhcmFtVXNlcklkID0gbS5yb3V0ZS5wYXJhbSgndXNlcl9pZCcpO1xuICBpZihwYXJhbVVzZXJJZCA9PSBDdXJyZW50VXNlci5pZCgpKSB7XG4gICAgdm0ucHJvZmlsZSA9IEN1cnJlbnRVc2VyLnByb2ZpbGUoKTtcbiAgICB2bS5oaWRlRm9sbG93QnV0dG9uID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBBUEkoJ0dFVCcsICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ3VzZXJfaWQnKSArICcvcHJvZmlsZScpLnRoZW4oZnVuY3Rpb24ocHJvZmlsZURhdGEpIHtcbiAgICAgIHZtLnByb2ZpbGUgPSBtLnByb3AobmV3IFByb2ZpbGUocHJvZmlsZURhdGEpKTtcbiAgICAgIHZtLmhpZGVGb2xsb3dCdXR0b24gPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIHZtLmZvbGxvd2VycyA9IEFQSSgnR0VUJywgJy91c2Vycy8nICsgcGFyYW1Vc2VySWQgKyAnL2ZvbGxvd2VycycpLnRoZW4oZnVuY3Rpb24oZm9sbG93ZXJzKSB7XG4gICAgcmV0dXJuIGZvbGxvd2Vycy5tYXAoZnVuY3Rpb24oZiwgaW5kZXgpIHtyZXR1cm4gbmV3IFByb2ZpbGUoZil9KTtcbiAgfSk7XG5cbiAgdm0uZm9sbG93aW5ncyA9IEFQSSgnR0VUJywgJy91c2Vycy8nICsgcGFyYW1Vc2VySWQgKyAnL2ZvbGxvd2luZ3MnKS50aGVuKGZ1bmN0aW9uKGZvbGxvd2luZ3MpIHtcbiAgICByZXR1cm4gZm9sbG93aW5ncy5tYXAoZnVuY3Rpb24oZiwgaW5kZXgpIHtyZXR1cm4gbmV3IFByb2ZpbGUoZil9KTtcbiAgfSk7XG5cbiAgdmFyIGN1cnJlbnRVcmwgPSBtLnJvdXRlKCk7XG4gIHZtLmZvbGxvd2Vyc1JvdXRlID0gZnVuY3Rpb24oKSB7XG4gICAgbS5yb3V0ZShjdXJyZW50VXJsICsgXCIvZm9sbG93ZXJzXCIpO1xuICB9O1xuICB2bS5mb2xsb3dpbmdSb3V0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIG0ucm91dGUoY3VycmVudFVybCArIFwiL2ZvbGxvd2luZ1wiKTtcbiAgfTtcblxuICB2bS5mb2xsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBcbiAgfTtcbn07XG5cblByb2ZpbGVQYWdlLnZpZXcgPSBmdW5jdGlvbihjdHJsKSB7cmV0dXJuIChcbiAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiY29udGFpbmVyXCIsIGlkOlwiUHJvZmlsZVwifSwgY2hpbGRyZW46IFtcbiAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJyb3dcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb2wtbWQtOCBjb2wteHMtMTBcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcIndlbGwgcGFuZWwgcGFuZWwtZGVmYXVsdFwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJwYW5lbC1ib2R5XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwicm93XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb2wteHMtMTIgY29sLXNtLTQgdGV4dC1jZW50ZXJcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcImltZ1wiLCBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICBzcmM6Y3RybC5wcm9maWxlKCkuZ2V0U2l6ZWRQaWN0dXJlKDIwMCksIFxuICAgICAgICAgICAgICAgICAgICBhbHQ6XCJQcm9maWxlIHBpY3R1cmVcIiwgXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOlwiY2VudGVyLWJsb2NrIGltZy1jaXJjbGUgaW1nLXRodW1ibmFpbCBpbWctcmVzcG9uc2l2ZVwiLCBcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OlwiMjAwXCIsIFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDpcIjIwMFwifX0sIFxuXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcInVsXCIsIGF0dHJzOiB7Y2xhc3M6XCJsaXN0LWlubGluZSByYXRpbmdzIHRleHQtY2VudGVyXCIsIHRpdGxlOlwiUmF0aW5nc1wifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJhXCIsIGF0dHJzOiB7aHJlZjpcIiNcIn0sIGNoaWxkcmVuOiBbe3RhZzogXCJzcGFuXCIsIGF0dHJzOiB7Y2xhc3M6XCJmYSBmYS1zdGFyIGZhLWxnXCJ9fV19XX0sIFxuICAgICAgICAgICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtocmVmOlwiI1wifSwgY2hpbGRyZW46IFt7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtjbGFzczpcImZhIGZhLXN0YXIgZmEtbGdcIn19XX1dfSwgXG4gICAgICAgICAgICAgICAgICAgIHt0YWc6IFwibGlcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3t0YWc6IFwiYVwiLCBhdHRyczoge2hyZWY6XCIjXCJ9LCBjaGlsZHJlbjogW3t0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiZmEgZmEtc3RhciBmYS1sZ1wifX1dfV19LCBcbiAgICAgICAgICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJhXCIsIGF0dHJzOiB7aHJlZjpcIiNcIn0sIGNoaWxkcmVuOiBbe3RhZzogXCJzcGFuXCIsIGF0dHJzOiB7Y2xhc3M6XCJmYSBmYS1zdGFyIGZhLWxnXCJ9fV19XX0sIFxuICAgICAgICAgICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtocmVmOlwiI1wifSwgY2hpbGRyZW46IFt7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtjbGFzczpcImZhIGZhLXN0YXIgZmEtbGdcIn19XX1dfVxuICAgICAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgICBdfSwgXG5cbiAgICAgICAgICAgICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiY29sLXhzLTEyIGNvbC1zbS04XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAge3RhZzogXCJoMlwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbY3RybC5wcm9maWxlKCkubmFtZSgpXX0sIFxuICAgICAgICAgICAgICAgICAge3RhZzogXCJwXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcInN0cm9uZ1wiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJBYm91dDogXCJdfSwgXCIgV2ViIERlc2lnbmVyIC8gVUkgRXhwZXJ0LiBcIl19LCBcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwicFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJzdHJvbmdcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW1wiSG9iYmllczogXCJdfSwgXCIgUmVhZCwgb3V0IHdpdGggZnJpZW5kcywgbGlzdGVuIHRvIG11c2ljLCBkcmF3IGFuZCBsZWFybiBuZXcgdGhpbmdzLiBcIl19LCBcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwiYnV0dG9uXCIsIGF0dHJzOiB7Y2xhc3M6XCJidG4gYnRuLXdhcm5pbmdcIiwgb25jbGljazpjdHJsLmZvbGxvdywgZGlzYWJsZWQ6Y3RybC5oaWRlRm9sbG93QnV0dG9ufSwgY2hpbGRyZW46IFtjdHJsLmhpZGVGb2xsb3dCdXR0b24gPyBcIkFscmVhZHlcIiA6IFwiRm9sbG93XCJdfVxuICAgICAgICAgICAgICAgIF19LCBcblxuICAgICAgICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjbGVhcmZpeFwifX0sIFxuICAgICAgICAgICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb2wteHMtMTIgY29sLXNtLTRcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcImgyXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcInN0cm9uZ1wiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbY3RybC5mb2xsb3dlcnMoKS5sZW5ndGhdfV19LCBcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwicFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJzbWFsbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJGb2xsb3dlcnNcIl19XX0sIFxuICAgICAgICAgICAgICAgICAge3RhZzogXCJidXR0b25cIiwgYXR0cnM6IHtjbGFzczpcImJ0biBidG4tc3VjY2VzcyBidG4tYmxvY2tcIiwgb25jbGljazpjdHJsLmZvbGxvd2Vyc1JvdXRlfSwgY2hpbGRyZW46IFt7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHtjbGFzczpcImZhIGZhLXBsdXMtY2lyY2xlXCJ9fSwgXCJWaWV3IEZvbGxvd2Vyc1wiXX1cbiAgICAgICAgICAgICAgICBdfSwgXG5cbiAgICAgICAgICAgICAgICB7dGFnOiBcImRpdlwiLCBhdHRyczoge2NsYXNzOlwiY29sLXhzLTEyIGNvbC1zbS00XCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAge3RhZzogXCJoMlwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJzdHJvbmdcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW2N0cmwuZm9sbG93aW5ncygpLmxlbmd0aF19XX0sIFxuICAgICAgICAgICAgICAgICAge3RhZzogXCJwXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcInNtYWxsXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFtcIkZvbGxvd2luZ1wiXX1dfSwgXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcImJ1dHRvblwiLCBhdHRyczoge2NsYXNzOlwiYnRuIGJ0bi1pbmZvIGJ0bi1ibG9ja1wiLCBvbmNsaWNrOmN0cmwuZm9sbG93aW5nUm91dGV9LCBjaGlsZHJlbjogW3t0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiZmEgZmEtdXNlclwifX0sIFwiVmlldyBGb2xsb3dpbmdcIl19XG4gICAgICAgICAgICAgICAgXX0sIFxuXG4gICAgICAgICAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtjbGFzczpcImNvbC14cy0xMiBjb2wtc20tNFwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwiaDJcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3t0YWc6IFwic3Ryb25nXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFtcIjQzXCJdfV19LCBcbiAgICAgICAgICAgICAgICAgIHt0YWc6IFwicFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJzbWFsbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbXCJTbmlwcGV0c1wiXX1dfSwgXG4gICAgICAgICAgICAgICAgICB7dGFnOiBcImJ1dHRvblwiLCBhdHRyczoge3R5cGU6XCJidXR0b25cIiwgY2xhc3M6XCJidG4gYnRuLXByaW1hcnkgYnRuLWJsb2NrXCJ9LCBjaGlsZHJlbjogW3t0YWc6IFwic3BhblwiLCBhdHRyczoge2NsYXNzOlwiZmEgZmEtZ2VhclwifX0sIFwiIE9wdGlvbnMgXCJdfVxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgIF19XG4gICAgICAgICAgICBdfVxuICAgICAgICAgIF19XG4gICAgICAgIF19XG4gICAgICBdfVxuICAgIF19XG4gICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2ZpbGVQYWdlOyIsInZhciBQcm9maWxlUGFnZSA9IHJlcXVpcmUoJy4vUHJvZmlsZS9wcm9maWxlX3ZpZXcuanMnKTtcbnZhciBQcm9maWxlS29ydmFpc1BhZ2UgPSByZXF1aXJlKCcuL0tvcnZhaXMva29ydmFpX2xpc3QuanMnKTtcblxudmFyIF9mb2xsb3dpbmdzUGFnZXMgPSByZXF1aXJlKCcuL0ZvbGxvd2luZ3MvZm9sbG93aW5ncy5qcycpO1xuXG52YXIgRm9sbG93ZXJzUGFnZSA9IF9mb2xsb3dpbmdzUGFnZXMuRm9sbG93ZXJzUGFnZTtcbnZhciBGb2xsb3dpbmdzUGFnZSA9IF9mb2xsb3dpbmdzUGFnZXMuRm9sbG93aW5nc1BhZ2U7XG5cbnZhciBLb3J2YWlEZXRhaWxQYWdlID0gcmVxdWlyZSgnLi9Lb3J2YWlzL2tvcnZhaV9kZXRhaWwuanMnKTtcbnZhciBDcmVhdGVLb3J2YWlQYWdlID0gcmVxdWlyZSgnLi9Lb3J2YWlzL2NyZWF0ZV9rb3J2YWkuanMnKTtcblxudmFyIEN1cnJlbnRVc2VyID0gcmVxdWlyZSgnLi9jb21tb24vbW9kZWxzL2N1cnJlbnRfdXNlci5qcycpO1xuXG4vLyBIZWFkZXIgTGF5b3V0XG5cbnZhciBIZWFkZXIgPSB7fTtcblxuSGVhZGVyLmNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgaWYoIUN1cnJlbnRVc2VyLmlkKCkpIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiLyMvbG9naW5cIik7XG4gIGVsc2Uge1xuICAgIHRoaXMucHJvZmlsZSA9IEN1cnJlbnRVc2VyLnByb2ZpbGUoKTtcblxuICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgQ3VycmVudFVzZXIuY2xlYXIoKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiL1wiKTtcbiAgICB9O1xuICB9XG59O1xuXG5IZWFkZXIudmlldyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgdmFyIG15UHJvZmlsZUxpbmsgPSAnIy91c2Vycy8nICsgQ3VycmVudFVzZXIuaWQoKTtcblxuICByZXR1cm4gKFxuICAgIHt0YWc6IFwibmF2XCIsIGF0dHJzOiB7Y2xhc3M6XCJuYXZiYXIgbmF2YmFyLWludmVyc2UgbmF2YmFyLWZpeGVkLXRvcFwiLCBpZDpcIkhlYWRlclwifSwgY2hpbGRyZW46IFtcbiAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJjb250YWluZXItZmx1aWRcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJuYXZiYXItaGVhZGVyXCJ9LCBjaGlsZHJlbjogW1xuICAgICAgICAgIHt0YWc6IFwiYVwiLCBhdHRyczoge2NsYXNzOlwibmF2YmFyLWJyYW5kXCIsIGhyZWY6XCIjXCIsIGlkOlwibG9nb1wifSwgY2hpbGRyZW46IFtcIkNhcm5hdGljXCJdfVxuICAgICAgICBdfSwgXG5cbiAgICAgICAge3RhZzogXCJkaXZcIiwgYXR0cnM6IHtpZDpcIm5hdmJhclwiLCBjbGFzczpcIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwifSwgY2hpbGRyZW46IFtcbiAgICAgICAgICB7dGFnOiBcInVsXCIsIGF0dHJzOiB7Y2xhc3M6XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIn0sIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtocmVmOlwiIy9rb3J2YWlzL25ld1wifSwgY2hpbGRyZW46IFtcIk5ldyBLb3J2YWlcIl19XX0sIFxuICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJhXCIsIGF0dHJzOiB7aHJlZjpcIiMva29ydmFpc1wifSwgY2hpbGRyZW46IFtcIktvcnZhaXNcIl19XX0sIFxuICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge2NsYXNzOlwiZGl2aWRlclwifX0sIFxuICAgICAgICAgICAge3RhZzogXCJsaVwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBbe3RhZzogXCJhXCIsIGF0dHJzOiB7aHJlZjpteVByb2ZpbGVMaW5rfSwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAge3RhZzogXCJpbWdcIiwgYXR0cnM6IHtzcmM6Y3RybC5wcm9maWxlKCkuZ2V0U2l6ZWRQaWN0dXJlKDIwKX19LCBcIsKgwqBcIiwgXG4gICAgICAgICAgICAgIGN0cmwucHJvZmlsZSgpLm5hbWUoKVxuICAgICAgICAgICAgXX1dfSwgXG4gICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7Y2xhc3M6XCJkaXZpZGVyXCJ9fSwgXG4gICAgICAgICAgICB7dGFnOiBcImxpXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt7dGFnOiBcImFcIiwgYXR0cnM6IHtvbmNsaWNrOmN0cmwubG9nb3V0LCBocmVmOlwiXCJ9LCBjaGlsZHJlbjogW1wiTG9nb3V0XCJdfV19XG4gICAgICAgICAgXX1cbiAgICAgICAgXX1cbiAgICAgIF19XG4gICAgXX1cbiAgKTtcbn07XG5cbm0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0hlYWRlckNvbnRhaW5lcicpLCBIZWFkZXIpO1xuXG4vLyBoZWxwZXJzXG5cblN0cmluZy5wcm90b3R5cGUucmVwZWF0ID0gZnVuY3Rpb24obnVtKSB7XG4gIHJldHVybiBuZXcgQXJyYXkobnVtICsgMSkuam9pbih0aGlzKTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKGZpbmQsIHJlcGxhY2UpIHtcbiAgcmV0dXJuIHRoaXMucmVwbGFjZShuZXcgUmVnRXhwKGZpbmQsICdnJyksIHJlcGxhY2UpO1xufTtcblxuQXJyYXkucHJvdG90eXBlLnJlbW92ZUR1cGxpY2F0ZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucmVkdWNlKGZ1bmN0aW9uKGFjY3VtLCBjdXJyZW50KSB7XG4gICAgaWYoYWNjdW0uaW5kZXhPZihjdXJyZW50KSA8IDApIGFjY3VtLnB1c2goY3VycmVudCk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9LCBbXSk7XG59O1xuXG4vLyBvcHRpb25zIGFuZCBjb25maWd1cmF0aW9uXG5cbnRvYXN0ci5vcHRpb25zID0ge1xuICBcIm5ld2VzdE9uVG9wXCI6IHRydWUsXG4gIFwicG9zaXRpb25DbGFzc1wiOiBcInRvYXN0LWJvdHRvbS1mdWxsLXdpZHRoXCJcbn07XG5cbi8vIHJvdXRlc1xuXG5tLnJvdXRlLm1vZGUgPSAnaGFzaCc7XG5tLnJvdXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdBcHBDb250YWluZXInKSwgJy9rb3J2YWlzJywge1xuICAnL2tvcnZhaXMnOiBQcm9maWxlS29ydmFpc1BhZ2UsXG4gICcva29ydmFpcy86a29ydmFpX2lkJzogS29ydmFpRGV0YWlsUGFnZSxcbiAgJy9rb3J2YWlzL25ldyc6IENyZWF0ZUtvcnZhaVBhZ2UsXG5cbiAgJy91c2Vycy86dXNlcl9pZCc6IFByb2ZpbGVQYWdlLFxuICAnL3VzZXJzLzp1c2VyX2lkL2ZvbGxvd2Vycyc6IEZvbGxvd2Vyc1BhZ2UsXG4gICcvdXNlcnMvOnVzZXJfaWQvZm9sbG93aW5nJzogRm9sbG93aW5nc1BhZ2Vcbn0pOyIsInZhciBBUEkgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9hcGlfc2VydmljZS5qcycpO1xudmFyIEtvcnZhaSA9IHJlcXVpcmUoJy4uL21vZGVscy9rb3J2YWkuanMnKTtcbnZhciBQcm9maWxlID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Byb2ZpbGUuanMnKTtcblxudmFyIEN1cnJlbnRVc2VyID0gKGZ1bmN0aW9uKCl7XG4gIHZhciBsb2NhbFVzZXJEYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FybmF0aWMtY3VycmVudFVzZXInKSkgfHwge307XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogbS5wcm9wKGxvY2FsVXNlckRhdGEuaWQgfHwgJycpLFxuICAgIGVtYWlsOiBtLnByb3AobG9jYWxVc2VyRGF0YS5lbWFpbCB8fCAnJyksXG4gICAgYXV0aF90b2tlbjogbS5wcm9wKGxvY2FsVXNlckRhdGEuYXV0aF90b2tlbiB8fCAnJylcbiAgfTtcbn0oKSk7XG5cbkN1cnJlbnRVc2VyLnNldFVzZXIgPSBmdW5jdGlvbih1c2VyRGF0YSkge1xuICBDdXJyZW50VXNlci5pZCh1c2VyRGF0YS5pZCk7XG4gIEN1cnJlbnRVc2VyLmVtYWlsKHVzZXJEYXRhLmVtYWlsKTtcbiAgQ3VycmVudFVzZXIuYXV0aF90b2tlbih1c2VyRGF0YS5hdXRoX3Rva2VuKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Nhcm5hdGljLWN1cnJlbnRVc2VyJywgSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpKTtcbn07XG5cbkN1cnJlbnRVc2VyLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdjYXJuYXRpYy1jdXJyZW50VXNlcicpO1xuICBDdXJyZW50VXNlci5pZCgnJyk7XG4gIEN1cnJlbnRVc2VyLmVtYWlsKCcnKTtcbiAgQ3VycmVudFVzZXIuYXV0aF90b2tlbignJyk7XG59O1xuXG5DdXJyZW50VXNlci5wcm9maWxlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBUEkoJ0dFVCcsICcvdXNlcnMvJyArIEN1cnJlbnRVc2VyLmlkKCkgKyAnL3Byb2ZpbGUnKS50aGVuKGZ1bmN0aW9uKHByb2ZpbGUpIHtcbiAgICByZXR1cm4gbmV3IFByb2ZpbGUocHJvZmlsZSk7XG4gIH0pO1xufTtcblxuQ3VycmVudFVzZXIua29ydmFpcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQVBJKCdHRVQnLCAnL3VzZXJzLycgKyBDdXJyZW50VXNlci5pZCgpICsgJy9rb3J2YWlzJykudGhlbihmdW5jdGlvbihrb3J2YWlzKSB7XG4gICAgcmV0dXJuIGtvcnZhaXMubWFwKGZ1bmN0aW9uKGssIGluZGV4KSB7cmV0dXJuIG5ldyBLb3J2YWkoayl9KTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnJlbnRVc2VyOyIsInZhciBLb3J2YWkgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHRoaXMuaWQgPSBtLnByb3AoZGF0YS5pZCB8fCAwKTtcbiAgdGhpcy51c2VyX2lkID0gbS5wcm9wKGRhdGEudXNlcl9pZCB8fCAwKTtcbiAgdGhpcy5jb250ZW50ID0gbS5wcm9wKGRhdGEuY29udGVudCB8fCAnJyk7XG4gIHRoaXMudGhhbGFtID0gbS5wcm9wKGRhdGEudGhhbGFtIHx8IDMyKTtcbiAgdGhpcy5tYXRyYXNfYWZ0ZXIgPSBtLnByb3AoZGF0YS5tYXRyYXNBZnRlciB8fCAwKTtcbiAgdGhpcy5jcmVhdGVkX2F0ID0gbS5wcm9wKGRhdGEuY3JlYXRlZF9hdCB8fCAnJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtvcnZhaTsiLCJ2YXIgQVBJID0gcmVxdWlyZSgnLi4vc2VydmljZXMvYXBpX3NlcnZpY2UuanMnKTtcblxudmFyIFByb2ZpbGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHZhciBwID0gdGhpcztcblxuICBwLmlkID0gbS5wcm9wKGRhdGEuaWQgfHwgMCk7XG4gIHAudXNlcl9pZCA9IG0ucHJvcChkYXRhLnVzZXJfaWQgfHwgMCk7XG4gIHAubmFtZSA9IG0ucHJvcChkYXRhLm5hbWUgfHwgJycpO1xuXG4gIHAucGljdHVyZV91cmwgPSBtLnByb3AoZGF0YS5waWN0dXJlX3VybCB8fCAnJyk7XG4gIHAuZ2V0U2l6ZWRQaWN0dXJlID0gZnVuY3Rpb24oc2l6ZSkge1xuICAgIHJldHVybiBwLnBpY3R1cmVfdXJsKCkgKyBcIiZzPVwiICsgc2l6ZTtcbiAgfVxuICBcbiAgcC5jcmVhdGVkX2F0ID0gbS5wcm9wKGRhdGEuY3JlYXRlZF9hdCB8fCAnJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2ZpbGU7IiwiLy8gcmVxdWlyZXMgbWV0aG9kIChlLmcuIEdFVCwgUE9TVCwgZXRjLilcbi8vIHJlcXVpcmVzIHVybCAoZS5nLiAnL3VzZXJzLzEnKVxuLy8gb3B0aW9uYWwgZGF0YSAoamF2YXNjcmlwdCBvYmplY3QpXG4vLyBvcHRpb25hbCBhdXRoX3Rva2VuIChpZiBhdXRoZW50aWNhdGlvbiBpcyByZXF1aXJlZClcbnZhciBBUEkgPSBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgYXV0aF90b2tlbikge1xuICB2YXIgeGhyQ29uZmlnID0gZnVuY3Rpb24oeGhyKSB7XG4gICAgaWYoYXV0aF90b2tlbikgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnVG9rZW4gJyArIGF1dGhfdG9rZW4pO1xuICB9O1xuXG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcgKyB1cmwsXG4gICAgZGF0YTogZGF0YSB8fCB7fSxcbiAgICBjb25maWc6IHhockNvbmZpZ1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQVBJOyIsInZhciBNYXRyYXNTZXJ2aWNlID0gcmVxdWlyZSgnLi9tYXRyYXNfc2VydmljZS5qcycpO1xuXG52YXIgS29ydmFpU2VydmljZSA9IHtcbiAgdG9Nc3g6IGZ1bmN0aW9uKGtvcnZhaSkge1xuICAgIHZhciBrb3J2YWlXb3JkcyA9IHRoaXMuYWRkV2hpdGVzcGFjZShrb3J2YWkpLm1hdGNoKC8oW2EtekEtelxcKFxcKVxcW1xcXVxcbl0rfFxcL1swLTldKykvZyk7XG4gICAgcmV0dXJuIHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7Y2xhc3M6XCJrb3J2YWktY29udGVudFwifSwgY2hpbGRyZW46IFt0aGlzLmZvcm1hdFdvcmRzKGtvcnZhaVdvcmRzKV19O1xuICB9LFxuXG4gIGZvcm1hdE1hdHJhQ291bnQ6IGZ1bmN0aW9uKGtvcnZhaSwgdGhhbGFtKSB7XG4gICAgdmFyIHRvdGFsTWF0cmFzID0gdGhpcy5jb3VudE1hdHJhcyhrb3J2YWkpO1xuXG4gICAgdmFyIGF2YXJ0aGFuYW1zID0gTWF0aC5mbG9vcih0b3RhbE1hdHJhcyAvIHRoYWxhbSk7XG4gICAgdmFyIGF2YXJ0aGFuYW1zUGhyYXNlID0gYXZhcnRoYW5hbXMudG9TdHJpbmcoKSArIFwiIGF2YXJ0aGFuYW1cIiArIChhdmFydGhhbmFtcyAhPT0gMSA/IFwic1wiIDogXCJcIikgKyBcIiwgXCI7XG5cbiAgICB2YXIgbWF0cmFzUmVtYWluaW5nID0gdG90YWxNYXRyYXMgJSB0aGFsYW07XG4gICAgdmFyIG1hdHJhc1BocmFzZSA9IG1hdHJhc1JlbWFpbmluZyArIFwiIG1hdHJhXCIgKyAobWF0cmFzUmVtYWluaW5nICE9PSAxID8gXCJzXCIgOiBcIlwiKTtcblxuICAgIHJldHVybiBhdmFydGhhbmFtc1BocmFzZSArIG1hdHJhc1BocmFzZTtcbiAgfSxcblxuICBjb3VudE1hdHJhczogZnVuY3Rpb24oa29ydmFpKSB7XG4gICAgcmV0dXJuIE1hdHJhc1NlcnZpY2UuY291bnRNYXRyYXMoa29ydmFpLCB0cnVlKTtcbiAgfSxcblxuICAvLyAtLS0tLS0tLSBQUklWQVRFIC0tLS0tLS0tXG5cbiAgZm9ybWF0V29yZHM6IGZ1bmN0aW9uKHdvcmRMaXN0LCBtb2RpZmllck9wZW5pbmdCcmFja2V0KSB7XG4gICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgLy8gaWYgZm9ybWF0V29yZHMgaXMgY2FsbGVkIG9uIGEgcmVwZWF0ZXIgb3IgYSBuYWRhaSBlbmNsb3NlZCBpbiBicmFja2V0c1xuICAgIGlmKG1vZGlmaWVyT3BlbmluZ0JyYWNrZXQpIHtcbiAgICAgIGNoaWxkcmVuLnB1c2goe3RhZzogXCJzcGFuXCIsIGF0dHJzOiB7Y2xhc3M6XCJtb2RpZmllci1icmFja2V0XCJ9LCBjaGlsZHJlbjogW21vZGlmaWVyT3BlbmluZ0JyYWNrZXQsIFwiwqBcIl19KTtcbiAgICB9XG5cbiAgICAvLyBvbmx5IGdvIHRvIHRoZSAybmQgbGFzdCBlbGVtZW50IGJlY2F1c2UgdGhlIGxhc3Qgb25lIGNvbnRhaW5zIHRoZSBudW1iZXIgZm9yIG1vZGlmaWNhdGlvblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB3b3JkTGlzdC5sZW5ndGggLSAobW9kaWZpZXJPcGVuaW5nQnJhY2tldCA/IDEgOiAwKTsgaSsrKSB7XG4gICAgICB2YXIgd29yZCA9IHdvcmRMaXN0W2ldO1xuICAgICAgdmFyIG9wZW5pbmdCcmFja2V0ID0gdGhpcy5vcGVuaW5nQnJhY2tldCh3b3JkKTtcblxuICAgICAgLy8gaWYgdGhlcmUncyBhbiBvcGVuaW5nIGJyYWNrZXQsIHRoZW4gYSBtb2RpZmllciBiZWdpbnNcbiAgICAgIGlmKG9wZW5pbmdCcmFja2V0KSB7XG4gICAgICAgIHZhciBqID0gaTtcbiAgICAgICAgdmFyIGJyYWNrZXRzID0gMDtcblxuICAgICAgICB3aGlsZShqIDwgd29yZExpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgd29yZCA9IHdvcmRMaXN0Wysral07XG4gICAgICAgICAgaWYodGhpcy5vcGVuaW5nQnJhY2tldCh3b3JkKSkgYnJhY2tldHMrKztcbiAgICAgICAgICBlbHNlIGlmKHRoaXMuY2xvc2luZ0JyYWNrZXQod29yZCkgJiYgIWJyYWNrZXRzKSBicmVhaztcbiAgICAgICAgICBlbHNlIGlmKHRoaXMuY2xvc2luZ0JyYWNrZXQod29yZCkpIGJyYWNrZXRzLS07XG4gICAgICAgIH1cblxuICAgICAgICBpZihqID09IHdvcmRMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2ludmFsaWQga29ydmFpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG1vZGlmaWVkID0gd29yZExpc3Quc2xpY2UoaSsxLCBqKTtcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZm9ybWF0V29yZHMobW9kaWZpZWQsIG9wZW5pbmdCcmFja2V0KSk7XG4gICAgICAgICAgaSA9IGo7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZih3b3JkID09IFwiXFxuXCIpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaCh7dGFnOiBcImJyXCIsIGF0dHJzOiB7fX0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaCh7dGFnOiBcInNwYW5cIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogW3dvcmQsIHt0YWc6IFwic3VwXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IFt0aGlzLmNvdW50TWF0cmFzKHdvcmQpXX0sIFwiIFwiXX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNsb3NlIHRoZSBicmFja2V0IGlmIGZvcm1hdFdvcmRzIHdhcyBjYWxsZWQgd2l0aCBhbiBlbmNsb3NlZCBtb2RpZmllclxuICAgIGlmKG1vZGlmaWVyT3BlbmluZ0JyYWNrZXQpIHtcbiAgICAgIGNoaWxkcmVuLnB1c2goe3RhZzogXCJzcGFuXCIsIGF0dHJzOiB7Y2xhc3M6XCJtb2RpZmllci1icmFja2V0XCJ9LCBjaGlsZHJlbjogW1wiwqBcIiwgKG1vZGlmaWVyT3BlbmluZ0JyYWNrZXQgPT0gJygnID8gJyknIDogJ10nKV19KTtcbiAgICAgIGlmKG1vZGlmaWVyT3BlbmluZ0JyYWNrZXQgPT0gJygnKSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2goXCIgw5cgXCIgKyB3b3JkTGlzdFtpXS5zdWJzdHJpbmcoMSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChcIiDihpIgXCIgKyB0aGlzLm51bWJlclRvTmFkYWkocGFyc2VJbnQod29yZExpc3RbaV0uc3Vic3RyaW5nKDEpKSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfSxcblxuICAvLyBhZGRzIHNwYWNlcyBiZXR3ZWVuIGFsbCB0aGUgbWlzYy4gY2hhcmFjdGVycyBhbmQgd2hpdGVzcGFjZVxuICBhZGRXaGl0ZXNwYWNlOiBmdW5jdGlvbihrb3J2YWkpIHtcbiAgICByZXR1cm4ga29ydmFpLnJlcGxhY2UoLyhbLDtcXChcXClcXFtcXF1cXG5dfFxcL1swLTldKykvZywgJyAkMSAnKTtcbiAgfSxcblxuICBvcGVuaW5nQnJhY2tldDogZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIChzdHIgPT0gJygnIHx8IHN0ciA9PSAnWycgPyBzdHIgOiBmYWxzZSk7XG4gIH0sXG5cbiAgY2xvc2luZ0JyYWNrZXQ6IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiAoc3RyID09ICcpJyB8fCBzdHIgPT0gJ10nID8gc3RyIDogZmFsc2UpO1xuICB9LFxuXG4gIG51bWJlclRvTmFkYWk6IGZ1bmN0aW9uKG51bSkge1xuICAgIHN3aXRjaChudW0pIHtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcmV0dXJuIFwidGhpc3JhbVwiO1xuICAgICAgY2FzZSA0OlxuICAgICAgICByZXR1cm4gXCJjaGF0dXNyYW1cIjtcbiAgICAgIGNhc2UgNTpcbiAgICAgICAgcmV0dXJuIFwia2FuZGFtXCI7XG4gICAgICBjYXNlIDY6XG4gICAgICAgIHJldHVybiBcIm1hZWwgdGhpc3JhbVwiO1xuICAgICAgY2FzZSA3OlxuICAgICAgICByZXR1cm4gXCJtaXNyYW1cIjtcbiAgICAgIGNhc2UgODpcbiAgICAgICAgcmV0dXJuIFwibWFlbCBjaGF0dXNyYW1cIjtcbiAgICAgIGNhc2UgOTpcbiAgICAgICAgcmV0dXJuIFwic2Fua2Vlcm5hbVwiO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLb3J2YWlTZXJ2aWNlOyIsInZhciBNYXRyYXNTZXJ2aWNlID0ge1xuICAvLyBjb3VudE1hdHJhcyhrb3J2YWkpIGNvdW50cyB0aGUgbnVtYmVyIG9mIG1hdHJhcyBpbiB0aGUga29ydmFpXG4gIC8vIFRPRE86IHRoaXMgb25seSB3b3JrcyBmb3IgMm5kIHNwZWVkXG4gIGNvdW50TWF0cmFzOiBmdW5jdGlvbihrb3J2YWksIGhhc05hZGFpcykge1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBrb3J2YWk7XG4gICAga29ydmFpID0gZGl2LnRleHRDb250ZW50IHx8IGRpdi5pbm5lclRleHQgfHwgJyc7XG5cbiAgICB2YXIgbWF0cmFzID0gMDtcblxuICAgIGlmKGhhc05hZGFpcykge1xuICAgICAgdmFyIG5hZGFpcyA9IHRoaXMuZmluZE1vZGlmaWVycyhrb3J2YWksIFwiW1wiLCBcIl1cIik7XG5cbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBuYWRhaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG4gPSBuYWRhaXNbaV07XG4gICAgICAgIG1hdHJhcyArPSB0aGlzLm5hZGFpTWF0cmFzKG4pO1xuICAgICAgICBrb3J2YWkgPSBrb3J2YWkucmVwbGFjZShcIltcIiArIG4gKyBcIl1cIiwgJycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciByZXBlYXRlcnMgPSB0aGlzLmZpbmRNb2RpZmllcnMoa29ydmFpLCBcIihcIiwgXCIpXCIpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHJlcGVhdGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHIgPSByZXBlYXRlcnNbaV07XG4gICAgICBtYXRyYXMgKz0gdGhpcy5yZXBlYXRlck1hdHJhcyhyKTtcbiAgICAgIGtvcnZhaSA9IGtvcnZhaS5yZXBsYWNlKFwiKFwiICsgciArIFwiKVwiLCAnJyk7XG4gICAgfVxuXG4gICAgbWF0cmFzICs9IHRoaXMubWF0cmFzV2l0aG91dE1vZGlmaWVycyhrb3J2YWkpO1xuICAgIHJldHVybiBtYXRyYXM7XG4gIH0sXG5cbiAgLy8gLS0tLS0tLS0gUFJJVkFURSAtLS0tLS0tLVxuICBcbiAgLy8gZmluZE1vZGlmaWVycyhzdHIsIG9CcmFja2V0LCBjQnJhY2tldCkgcHJvZHVjZXMgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAvLyBjb250ZW50IG9mIHRoZSBcIm1vZGlmaWVyc1wiIGluIHRoZSBnaXZlbiBrb3J2YWkgc3RyaW5nLCB3aGVyZSBhIG1vZGlmaWVyXG4gIC8vIGlzIGVpdGhlciBhIHJlcGVhdGVyIG9yIG5hZGFpXG4gIC8vIGEgcmVwZWF0ZXIgaXMgb2YgdGhlIGZvcm0gXCIodGhhdGhpbmtpbmF0aG9tIC8zKVwiIHdpdGggcGFyZW50aGVzZXNcbiAgLy8gYSBuYWRhaSBpcyBvZiB0aGUgZm9ybSBcIlt0aGF0aGlua2luYXRob20gLzNdXCIgd2l0aCBzcXVhcmUgYnJhY2tldHNcbiAgLy8gVE9ETzogY2xlYW4gdGhpcyB1cCwgaXQncyB2ZXJ5IG1lc3N5XG4gIGZpbmRNb2RpZmllcnM6IGZ1bmN0aW9uKHN0ciwgb0JyYWNrZXQsIGNCcmFja2V0KSB7XG4gICAgdmFyIGVuZFBvcyA9IC0xO1xuICAgIHZhciBtb2RpZmllcnMgPSBbXTtcblxuICAgIHdoaWxlKHRydWUpIHtcbiAgICAgIHdoaWxlKHN0ci5jaGFyQXQoZW5kUG9zICsgMSkgIT0gb0JyYWNrZXQgJiYgZW5kUG9zIDwgc3RyLmxlbmd0aCkgZW5kUG9zKys7XG4gICAgICBpZihlbmRQb3MgPT0gc3RyLmxlbmd0aCkgYnJlYWs7XG5cbiAgICAgIHZhciBvcGVuQnJhY2tldHMgPSAwO1xuICAgICAgdmFyIHN0YXJ0UG9zID0gZW5kUG9zO1xuXG4gICAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgIGNociA9IHN0ci5jaGFyQXQoKytlbmRQb3MpO1xuXG4gICAgICAgIGlmKGNociA9PSBvQnJhY2tldCkgb3BlbkJyYWNrZXRzKys7XG4gICAgICAgIGVsc2UgaWYoY2hyID09IGNCcmFja2V0KSBvcGVuQnJhY2tldHMtLTtcblxuICAgICAgICBpZighKG9wZW5CcmFja2V0cyA+IDAgJiYgZW5kUG9zIDwgc3RyLmxlbmd0aCkpIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZihlbmRQb3MgPT0gc3RyLmxlbmd0aCkgYnJlYWs7XG5cbiAgICAgIG1vZGlmaWVycy5wdXNoKHN0ci5zdWJzdHJpbmcoc3RhcnRQb3MgKyAyLCBlbmRQb3MpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kaWZpZXJzO1xuICB9LFxuXG4gIC8vIHJlcGVhdFN0cmluZyhyKSBjb25zdW1lcyBhIHJlcGVhdGVyIChhcyBkZWZpbmVkIGFib3ZlKVxuICAvLyBhbmQgcHJvZHVjZXMgdGhlIHJlcGVhdGVkIHNlcXVlbmNlIGFzIGEgc3RyaW5nIChvciBmYWxzZSBpZiBub3QgZm91bmQpXG4gIC8vIGUuZy4gKHRoYXRoaW5raW5hdGhvbSAvMykgcHJvZHVjZXMgXCJ0aGF0aGlua2luYXRob20gdGhhdGhpbmtpbmF0aG9tIHRoYXRoaW5raW5hdGhvbSBcIlxuICByZXBlYXRTdHJpbmc6IGZ1bmN0aW9uKHIpIHtcbiAgICB2YXIgbGFzdFNsYXNoID0gci5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgaWYobGFzdFNsYXNoID09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgclN0cmluZyA9IHIuc3Vic3RyaW5nKDAsIGxhc3RTbGFzaCk7XG4gICAgdmFyIHJlcGVhdGVycyA9IHRoaXMuZmluZE1vZGlmaWVycyhyU3RyaW5nLCBcIihcIiwgXCIpXCIpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHJlcGVhdGVycy5sZW5ndGg7IGkrKylcbiAgICAgIHJTdHJpbmcgPSB0aGlzLnJlcGxhY2VSZXBlYXRlcihyU3RyaW5nLCByZXBlYXRlcnNbaV0pO1xuXG4gICAgdmFyIG51bU9mUmVwZWF0cyA9IHBhcnNlSW50KHIuc2xpY2UobGFzdFNsYXNoICsgMSkpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiByU3RyaW5nLnJlcGVhdChudW1PZlJlcGVhdHMpO1xuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogSW52YWxpZCByZXBlYXRlciBzeW50YXg6IFwiLCBlcnJvcik7XG4gICAgICByZXR1cm4gclN0cmluZztcbiAgICB9XG4gIH0sXG5cbiAgLy8gcmVwbGFjZVJlcGVhdGVyKHN0ciwgcikgcmVwbGFjZXMgdGhlIG9jY3VycmVuY2VzIG9mIHRoZSByZXBlYXRlclxuICAvLyBpbiB0aGUgZ2l2ZW4gc3RyaW5nXG4gIHJlcGxhY2VSZXBlYXRlcjogZnVuY3Rpb24oc3RyLCByKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKFwiKFwiICsgciArIFwiKVwiLCB0aGlzLnJlcGVhdFN0cmluZyhyKSk7XG4gIH0sXG5cbiAgLy8gcmVwZWF0ZXJNYXRyYXMocikgY291bnRzIHRoZSBudW1iZXIgb2YgbWF0cmFzIGluIHRoZSBnaXZlbiByZXBlYXRlclxuICByZXBlYXRlck1hdHJhczogZnVuY3Rpb24ocikge1xuICAgIHJldHVybiB0aGlzLm1hdHJhc1dpdGhvdXRNb2RpZmllcnModGhpcy5yZXBlYXRTdHJpbmcocikpO1xuICB9LFxuXG4gIG5hZGFpTWF0cmFzOiBmdW5jdGlvbihuKSB7XG4gICAgdmFyIGxhc3RTbGFzaCA9IG4ubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgIGlmKGxhc3RTbGFzaCA9PSAtMSkgcmV0dXJuO1xuXG4gICAgdmFyIG5TdHJpbmcgPSBuLnN1YnN0cmluZygwLCBsYXN0U2xhc2gpO1xuXG4gICAgcmV0dXJuIHRoaXMuY291bnRNYXRyYXMoblN0cmluZywgZmFsc2UpICogNCAvIHBhcnNlSW50KG4uc2xpY2UobGFzdFNsYXNoICsgMSkpO1xuICB9LFxuXG4gIHdvcmRNYXRyYXM6IGZ1bmN0aW9uKHdvcmQpIHtcbiAgICB2YXIgdm93ZWxzID0gd29yZC5tYXRjaCgvW2FlaW91XS9nKTtcbiAgICBpZih2b3dlbHMpIHJldHVybiB2b3dlbHMubGVuZ3RoO1xuICAgIGVsc2UgcmV0dXJuIDA7XG4gIH0sXG5cbiAgbWF0cmFzV2l0aG91dE1vZGlmaWVyczogZnVuY3Rpb24oa29ydmFpKSB7XG4gICAgdmFyIG1hdHJhcyA9IDA7XG4gICAgdmFyIGtvcnZhaVdvcmRzID0ga29ydmFpLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sICcgJykuc3BsaXQoJyAnKTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBrb3J2YWlXb3Jkcy5sZW5ndGg7IGkrKylcbiAgICAgIG1hdHJhcyArPSB0aGlzLndvcmRNYXRyYXMoa29ydmFpV29yZHNbaV0pO1xuXG4gICAgdmFyIGNvbW1hcyA9IGtvcnZhaS5tYXRjaCgvLC9nKTtcbiAgICBtYXRyYXMgKz0gKGNvbW1hcyA/IGNvbW1hcy5sZW5ndGggOiAwKTtcblxuICAgIHZhciBzZW1pY29sb25zID0ga29ydmFpLm1hdGNoKC87L2cpO1xuICAgIG1hdHJhcyArPSAoc2VtaWNvbG9ucyA/IHNlbWljb2xvbnMubGVuZ3RoICogMiA6IDApO1xuXG4gICAgcmV0dXJuIG1hdHJhcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXRyYXNTZXJ2aWNlOyJdfQ==
