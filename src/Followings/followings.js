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
  var formattedPictureUrl = f.picture_url() + '&s=50';

  return (
    <div class="panel panel-default">
      <div class="panel-body">
        <img src={formattedPictureUrl} />&nbsp;&nbsp;
        {f.name()}
      </div>
    </div>
  );
};

FollowersPage.view = function(ctrl) {
  var followersList = ctrl.followers().map(followingTemplate);

  return (
    <div id="Followers">
      <h1>My Followers</h1><hr />
      {followersList}
    </div>
  );
};

FollowingsPage.view = function(ctrl) {
  var followingsList = ctrl.followings().map(followingTemplate);

  return (
    <div id="Followings">
      <h1>My Followings</h1><hr />
      {followingsList}
    </div>
  );
};

module.exports = {
  FollowersPage: FollowersPage,
  FollowingsPage: FollowingsPage
};