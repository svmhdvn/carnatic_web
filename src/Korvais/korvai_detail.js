var AppLayout = require('../common/layouts/app_layout.js');
var API = require('../common/services/api_service.js');
var Korvai = require('../common/models/korvai.js');
var KorvaiRenderService = require('../common/services/korvai_render_service.js');

var KorvaiDetailPage = {};

KorvaiDetailPage.controller = function() {
  var vm = this;

  m.startComputation();
  API('GET', '/korvais/' + m.route.param('korvai_id')).then(function(korvaiData) {
    vm.korvai = new Korvai(korvaiData);
    m.endComputation();
  });
};

KorvaiDetailPage.view = function(ctrl) {
  var korvaiHtml = KorvaiRenderService.toMsx(ctrl.korvai.content());

  return (
    <div id="KorvaiDetail">
      <h1>Korvai #{ctrl.korvai.id()}</h1>
      {korvaiHtml}
    </div>
  );
};

module.exports = KorvaiDetailPage;