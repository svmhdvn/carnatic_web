var API = require('../common/services/api_service.js');
var Korvai = require('../common/models/korvai.js');
var KorvaiService = require('../common/services/korvai_service.js');

var KorvaiDetailPage = {};

KorvaiDetailPage.controller = function() {
  var vm = this;

  API('GET', '/korvais/' + m.route.param('korvai_id')).then(function(korvaiData) {
    vm.korvai = new Korvai(korvaiData);
    vm.formattedMatraCount = KorvaiService.formatMatraCount(vm.korvai.content(), vm.korvai.thalam());
  });
};

KorvaiDetailPage.view = function(ctrl) {
  var korvaiHtml = KorvaiService.toMsx(ctrl.korvai.content());

  return (
    <div id="KorvaiDetail">
      <h1>Korvai #{ctrl.korvai.id()} <small>({ctrl.formattedMatraCount})</small></h1><hr />
      {korvaiHtml}
    </div>
  );
};

module.exports = KorvaiDetailPage;