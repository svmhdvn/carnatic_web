var CurrentUser = require('../models/current_user.js');

var Header = {};

Header.controller = function() {
  this.userId = CurrentUser.id();
};

Header.view = function(ctrl) {
  return (
    <nav class="navbar navbar-inverse navbar-fixed-top" id="Header">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#" id="logo">Carnatic</a>
        </div>

        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Help</a></li>
            <li class="divider"></li>
            <li><a href="#/me">{ctrl.userId}</a></li>
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