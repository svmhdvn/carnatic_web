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
      <a href={korvaiUrl}>
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h3 class="panel-title">{title}</h3>
          </div>
          <div class="panel-body">
            {korvai.content()}
          </div>
        </div>
      </a>
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