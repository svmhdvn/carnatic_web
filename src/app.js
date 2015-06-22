var LoginPage = require('./Static/login.js');
var RegisterPage = require('./Static/register.js');

var ProfilePage = require('./Profile/profile.js');
var ProfileKorvaisPage = require('./Korvais/korvai_list.js');

var KorvaiDetailPage = require('./Korvais/korvai_detail.js');
var CreateKorvaiPage = require('./Korvais/create_korvai.js');

var AppLayout = require('./common/layouts/app_layout.js');

var CurrentUser = require('./common/models/current_user.js');

var Authenticated = function(module) {
  return {
    controller: function() { return new Authenticated.controller(module); },
    view: AppLayout(Authenticated.view)
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
  '/register': RegisterPage,
  '/login': LoginPage,

  '/korvais': Authenticated(ProfileKorvaisPage),
  '/korvais/:korvai_id': Authenticated(KorvaiDetailPage),
  '/korvais/new': Authenticated(CreateKorvaiPage),

  '/me': Authenticated(ProfilePage)
});