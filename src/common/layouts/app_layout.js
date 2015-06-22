var CurrentUser = require('../models/current_user.js');
var AuthService = require('../services/auth_service.js');

var Header = {};

Header.controller = function() {
  this.profile = CurrentUser.profile();
  this.logout = function(e) {
    e.preventDefault();
    AuthService.logout();
    m.route('/');
  };
};

Header.view = function(ctrl) {
  return (
    <nav class="navbar navbar-inverse navbar-fixed-top" id="Header">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#" id="logo">Carnatic</a>
        </div>

        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#/korvais/new">New Korvai</a></li>
            <li><a href="#/korvais">Korvais</a></li>
            <li><a href="#/me">Profile</a></li>
            <li class="divider"></li>
            <li><a href="#/me">
              <img src={ctrl.profile().picture_url()} width="20" height="20" />&nbsp;&nbsp;
              {ctrl.profile().name()}
            </a></li>
            <li class="divider"></li>
            <li><a onclick={ctrl.logout} href="">Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

var AppLayout = function(view) {
  return function(ctrl) {
    return (
      <div id="AppLayout">
        <Header />
        <div class="container-fluid">
          {view(ctrl)}
        </div>
      </div>
    );
  };
};

module.exports = AppLayout;