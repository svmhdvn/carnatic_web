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
    <nav class="navbar navbar-inverse navbar-fixed-top" id="Header">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#" id="logo">Carnatic</a>
        </div>

        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#/korvais/new">New Korvai</a></li>
            <li><a href="#/korvais">Korvais</a></li>
            <li class="divider"></li>
            <li><a href={myProfileLink}>
              <img src={ctrl.profile().getSizedPicture(20)} />&nbsp;&nbsp;
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