var LoginPage = require('./Login/login.js');
var ProfilePage = require('./Profile/profile.js');
var ProfileKorvaisPage = require('./Korvais/korvaiList.js');
var KorvaiDetailPage = require('./Korvais/korvaiDetail.js');

var CurrentUser = require('./common/models/current_user.js');

var Authenticated = function(module) {
  return {
    controller: function() { return new Authenticated.controller(module); },
    view: Authenticated.view
  };
};

Authenticated.controller = function(module) {
  if(!CurrentUser.id()) m.route('/login');
  else this.content = module.view.bind(this, new module.controller);
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
  '/korvais/:korvai_id': Authenticated(KorvaiDetailPage),

  '/me': Authenticated(ProfilePage)
});