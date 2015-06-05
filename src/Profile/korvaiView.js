var ProfileKorvais = {};

ProfileKorvais.controller = function() {
  var vm = this;
  var korvaisRef = new Firebase('https://carnatic.firebaseio.com/korvais/' + CurrentUser.uid());

  vm.korvais = m.prop([]);
  var initialKorvaisLoaded = false;

  korvaisRef.on('child_added', function(snapshot) {
    if(initialKorvaisLoaded) {
      vm.korvais().push(new Korvai(snapshot.val()));
      m.redraw();
    }
  });

  korvaisRef.once('value', function(snapshot) {
    initialKorvaisLoaded = true;
    data = snapshot.val();

    for(var k in snapshot.val()) {
      vm.korvais().push(new Korvai(data[k]));
    }
    
    m.redraw();
  });
};

ProfileKorvais.view = AppLayout(function(ctrl) {
  var korvais = ctrl.korvais().map(function(korvai, index) {
    var title = "Thalam: " + korvai.thalam() + ", Matras after: " + korvai.matrasAfter();

    return (
      <div class="panel panel-primary">
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
      {korvais}
    </div>
  );
});