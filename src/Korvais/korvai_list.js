var CurrentUser = require('../common/models/current_user.js');

var ProfileKorvaisPage = {};

ProfileKorvaisPage.controller = function() {
  this.korvais = CurrentUser.korvais();

  this.goToKorvai = function(korvaiId) {
    return function() {
      m.route('/korvais/' + korvaiId);
    }
  };
};

ProfileKorvaisPage.view = function(ctrl) {
  var korvais = ctrl.korvais().map(function(korvai, index) {
    var title = "Thalam: " + korvai.thalam() + ", Matras after: " + korvai.matras_after();

    return (
      <div class="panel panel-primary" onclick={ctrl.goToKorvai(korvai.id())}>
        <div class="panel-heading">
          <h3 class="panel-title">{title}</h3>
        </div>
        <div class="panel-body">
          {korvai.content()}
        </div>
      </div>
    );
  });

  return (
    <div id="ProfileKorvais">
      <h1>Korvais View</h1><br />
      {korvais} <hr />

      <a href="#/korvais/new" class="btn btn-danger btn-large">Create korvai</a>
    </div>
  );
};

module.exports = ProfileKorvaisPage;