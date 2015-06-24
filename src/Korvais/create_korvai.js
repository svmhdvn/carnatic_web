var API = require('../common/services/api_service.js');
var Korvai = require('../common/models/korvai.js');
var KorvaiService = require('../common/services/korvai_service.js');
var CurrentUser = require('../common/models/current_user.js');

var CreateKorvaiPage = {};

CreateKorvaiPage.controller = function() {
  var vm = this;

  vm.korvai = new Korvai({});
  vm.korvaiPreview = m.prop('');

  vm.submit = function() {
    API('POST', '/korvais', {
      content: vm.korvai.content(),
      matras_after: vm.korvai.matras_after(),
      thalam: vm.korvai.thalam()
    }, CurrentUser.auth_token()).then(function(korvai) {
      toastr.success('Successfully created korvai!');
    }, function(error) {
      toastr.error('Error in creating korvai.');
    });
  };

  vm.preview = function() {
    vm.korvaiPreview(KorvaiService.toMsx(vm.korvai.content()));
  };
};

CreateKorvaiPage.view = function(ctrl) {
  autosize(document.getElementById('korvai-textarea'));

  return (
    <div id="CreateKorvai">
      <h1>Create new korvai</h1>
      <div class="row">
        <div class="col-md-6">
          <textarea 
            required 
            class="form-control" 
            rows="10" 
            id="korvai-textarea" 
            oninput={m.withAttr("value", ctrl.korvai.content)}></textarea>
        </div>

        <div class="col-md-6">
          <div class="well korvai-content" id="preview-container">{ctrl.korvaiPreview()}</div>
        </div>
      </div><br />
      
      <button class="btn btn-large btn-danger" onclick={ctrl.submit}>Submit</button>
      <button class="btn btn-large btn-warning" onclick={ctrl.preview}>Preview</button>
    </div>
  );
};

module.exports = CreateKorvaiPage;