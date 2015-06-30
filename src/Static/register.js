var AuthService = require('../common/services/auth_service.js');

var RegisterPage = {};

RegisterPage.controller = function() {
  var vm = this;

  vm.name = m.prop('');
  vm.email = m.prop('');
  vm.password = m.prop('');
  vm.password_confirmation = m.prop('');

  vm.alerts = m.prop([]);

  vm.register = function(e) {
    e.preventDefault();

    if(vm.name() && vm.email() && vm.password() && vm.password() == vm.password_confirmation()) {
      AuthService.register(vm.name(), vm.email(), vm.password()).then(function() {
        vm.alerts().push("Registration success!");
      }, function() {
        vm.alerts().push("Registration failure!");
      });
    } else {
      vm.alerts().push("Please recheck the fields, something went wrong");
    }
  }
};

RegisterPage.view = function(ctrl) {
  var alerts = ctrl.alerts().map(function(msg, index) {
    return (
      <div class="alert alert-warning alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {msg}
      </div>
    );
  });

  return (
    <div id="Register">
      <div class="container">
        <form class="form-signin" onsubmit={ctrl.register}>
          <h2 class="form-signin-heading">Register new account</h2>

          <label for="inputName" class="sr-only">Name</label>
          <input
            id="inputName"
            class="form-control"
            placeholder="Name"
            onchange={m.withAttr('value', ctrl.name)}
            value={ctrl.name()}
            required autofocus />

          <label for="inputEmail" class="sr-only">Email address</label>
          <input 
            type="email" 
            id="inputEmail" 
            class="form-control" 
            placeholder="Email address"
            onchange={m.withAttr('value', ctrl.email)}
            value={ctrl.email()}
            required />

          <label for="inputPasswordRegister" class="sr-only">Password</label>
          <input 
            type="password" 
            id="inputPasswordRegister" 
            class="form-control" 
            placeholder="Password"
            onchange={m.withAttr('value', ctrl.password)}
            value={ctrl.password()}
            required />

          <label for="inputPasswordConfirm" class="sr-only">Confirm Password</label>
          <input 
            type="password" 
            id="inputPasswordConfirm" 
            class="form-control" 
            placeholder="Confirm Password"
            onchange={m.withAttr('value', ctrl.password_confirmation)}
            value={ctrl.password_confirmation()}
            required />

          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>

        {alerts}
      </div>
    </div>
  );
};

m.mount(document.getElementById('RegisterContainer'), RegisterPage);