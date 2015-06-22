var AuthService = require('../common/services/auth_service.js');

var LoginPage = {};

LoginPage.controller = function() {
  var vm = this;

  vm.email = m.prop('');
  vm.password = m.prop('');
  vm.alerts = m.prop([]);

  vm.login = function(e) {
    if(vm.email() && vm.password()) {
      AuthService.login(vm.email(), vm.password()).then(function() {
        vm.alerts().push("Login success!");
      }, function() {
        vm.alerts().push("Login failure!");
      });
    } else {
      vm.alerts().push("Fields cannot be empty");
    }
  }
};

LoginPage.view = function(ctrl) {
  var alerts = ctrl.alerts().map(function(msg, index) {
    return (
      <div class="alert alert-warning alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {msg}
      </div>
    );
  });

  return (
    <div id="Login">
      <div class="container">
        <form class="form-signin" onsubmit={ctrl.login}>
          <h2 class="form-signin-heading">Please sign in</h2>

          <label for="inputEmail" class="sr-only">Email address</label>
          <input 
            type="email" 
            id="inputEmail" 
            class="form-control" 
            placeholder="Email address"
            onchange={m.withAttr('value', ctrl.email)}
            value={ctrl.email()}
            required autofocus />

          <label for="inputPassword" class="sr-only">Password</label>
          <input 
            type="password" 
            id="inputPassword" 
            class="form-control" 
            placeholder="Password"
            onchange={m.withAttr('value', ctrl.password)}
            value={ctrl.password()}
            required />

          <div class="checkbox">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>

          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>

        {alerts}
      </div>
    </div>
  );
};

module.exports = LoginPage;