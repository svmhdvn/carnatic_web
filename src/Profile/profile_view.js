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
};

ProfilePage.view = function(ctrl) {
  return (
    <div class="container" id="Profile">
      <div class="row">
        <div class="col-md-8 col-xs-10">
          <div class="well panel panel-default">
            <div class="panel-body">
              <div class="row">
                <div class="col-xs-12 col-sm-4 text-center">
                  <img 
                    src={ctrl.profile().picture_url()} 
                    alt="Profile picture" 
                    class="center-block img-circle img-thumbnail img-responsive" 
                    height="200"
                    width="200" />

                  <ul class="list-inline ratings text-center" title="Ratings">
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                  </ul>
                </div>

                <div class="col-xs-12 col-sm-8">
                  <h2>{ctrl.profile().name()}</h2>
                  <p><strong>About: </strong> Web Designer / UI Expert. </p>
                  <p><strong>Hobbies: </strong> Read, out with friends, listen to music, draw and learn new things. </p>
                  <button class="btn btn-warning" onclick={ctrl.follow} disabled={ctrl.hideFollowButton} >Follow</button>
                </div>

                <div class="clearfix"></div>
                <div class="col-xs-12 col-sm-4">
                  <h2><strong>{ctrl.followers().length}</strong></h2>
                  <p><small>Followers</small></p>
                  <button class="btn btn-success btn-block"><span class="fa fa-plus-circle"></span>View Followers</button>
                </div>

                <div class="col-xs-12 col-sm-4">
                  <h2><strong>{ctrl.followings().length}</strong></h2>
                  <p><small>Following</small></p>
                  <button class="btn btn-info btn-block"><span class="fa fa-user"></span>View Following</button>
                </div>

                <div class="col-xs-12 col-sm-4">
                  <h2><strong>43</strong></h2>
                  <p><small>Snippets</small></p>
                  <button type="button" class="btn btn-primary btn-block"><span class="fa fa-gear"></span> Options </button>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = ProfilePage;