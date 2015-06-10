var AppLayout = require('../common/layouts/app_layout.js');
var CurrentUser = require('../common/models/current_user.js');

var ProfilePage = {};

ProfilePage.controller = function() {
  this.uid = CurrentUser.uid();
  this.gravatarUrl = 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(CurrentUser.email()) + '?d=mm&s=256';
};

ProfilePage.view = AppLayout(function(ctrl) {
  return (
    <div class="container" id="Profile">
      <div class="row">
        <div class="col-md-8 col-xs-10">
          <div class="well panel panel-default">
            <div class="panel-body">
              <div class="row">
                <div class="col-xs-12 col-sm-4 text-center">
                  <img src={ctrl.gravatarUrl} alt="Profile picture" class="center-block img-circle img-thumbnail img-responsive" />
                  <ul class="list-inline ratings text-center" title="Ratings">
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                  </ul>
                </div>

                <div class="col-xs-12 col-sm-8">
                  <h2>{ctrl.uid}</h2>
                  <p><strong>About: </strong> Web Designer / UI Expert. </p>
                  <p><strong>Hobbies: </strong> Read, out with friends, listen to music, draw and learn new things. </p>
                  <p><strong>Skills: </strong>
                    <span class="label label-info tags">html5</span> 
                    <span class="label label-info tags">css3</span>
                    <span class="label label-info tags">jquery</span>
                    <span class="label label-info tags">bootstrap3</span>
                  </p>
                </div>

                <div class="clearfix"></div>
                <div class="col-xs-12 col-sm-4">
                  <h2><strong> 20,7K </strong></h2>
                  <p><small>Followers</small></p>
                  <button class="btn btn-success btn-block"><span class="fa fa-plus-circle"></span> Follow </button>
                </div>

                <div class="col-xs-12 col-sm-4">
                  <h2><strong>245</strong></h2>
                  <p><small>Following</small></p>
                  <button class="btn btn-info btn-block"><span class="fa fa-user"></span> View Profile </button>
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
});

module.exports = ProfilePage;