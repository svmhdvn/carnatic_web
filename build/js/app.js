var CurrentUser = (function(){
  var localUserData = JSON.parse(localStorage.getItem('carnatic-currentUser')) || {};

  return {
    authToken: m.prop(localUserData.auth_token || ''),
    id: m.prop(localUserData.id || ''),
    email: m.prop(localUserData.email || '')
  }
}());

CurrentUser.reset = function(userData) {
  CurrentUser.authToken(userData.auth_token);
  CurrentUser.id(userData.id);
  CurrentUser.email(userData.email);
  localStorage.setItem('carnatic-currentUser', JSON.stringify(userData));
}

var AuthService = {
  login: function(email, password) {
    return m.request({
      method: 'POST',
      url: 'http://localhost:3000/users/login',
      data: {
        email: email,
        password: password
      }
    }).then(function(response) {
      CurrentUser.reset(response);
    });
  }
}
var Login = {
  skipAuth: true
};

Login.controller = function() {
  var vm = this;

  vm.email = m.prop('');
  vm.password = m.prop('');
  vm.alerts = m.prop([]);

  vm.login = function(e) {
    e.preventDefault();

    if(vm.email() && vm.password()) {
      AuthService.login(vm.email(), vm.password()).then(function() {
        console.log('Current user model: ', CurrentUser);
        vm.alerts().push("Login success!");
      }, function() {
        vm.alerts().push("Login failure!");
      });
    } else {
      vm.alerts().push("Fields cannot be empty");
    }
  }
};

Login.view = function(ctrl) {
  var alerts = ctrl.alerts().map(function(msg, index) {
    return (
      {tag: "div", attrs: {class:"alert alert-warning alert-dismissible", role:"alert"}, children: [
        {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"alert", "aria-label":"Close"}, children: [{tag: "span", attrs: {"aria-hidden":"true"}, children: ["×"]}]}, 
        msg
      ]}
    );
  });

  return (
    {tag: "div", attrs: {id:"Login"}, children: [
      {tag: "div", attrs: {class:"container"}, children: [
        {tag: "form", attrs: {class:"form-signin", onsubmit:ctrl.login}, children: [
          {tag: "h2", attrs: {class:"form-signin-heading"}, children: ["Please sign in"]}, 

          {tag: "label", attrs: {for:"inputEmail", class:"sr-only"}, children: ["Email address"]}, 
          {tag: "input", attrs: {
            type:"email", 
            id:"inputEmail", 
            class:"form-control", 
            placeholder:"Email address", 
            onchange:m.withAttr('value', ctrl.email), 
            value:ctrl.email(), 
            required:true,autofocus:true}}, 

          {tag: "label", attrs: {for:"inputPassword", class:"sr-only"}, children: ["Password"]}, 
          {tag: "input", attrs: {
            type:"password", 
            id:"inputPassword", 
            class:"form-control", 
            placeholder:"Password", 
            onchange:m.withAttr('value', ctrl.password), 
            value:ctrl.password(), 
            required:true}}, 

          {tag: "div", attrs: {class:"checkbox"}, children: [
            {tag: "label", attrs: {}, children: [
              {tag: "input", attrs: {type:"checkbox", value:"remember-me"}}, " Remember me"
            ]}
          ]}, 

          {tag: "button", attrs: {class:"btn btn-lg btn-primary btn-block", type:"submit"}, children: ["Sign in"]}
        ]}, 

        alerts
      ]}
    ]}
  );
};
function authRoutes(root, defaultRoute, router) {
  for(var route in router) {
    var module = router[route];

    router[route] = {
      view: module.view,
      controller: module.skipAuth ? module.controller : function authController() {
        if(CurrentUser.auth_token()) success();
        else failure();

        function success() {
          m.module(root, module);
        }

        function failure() {
          m.module(root, router['/login']);
        }
      }
    };
  }

  m.route.mode = 'hash';
  m.route(root, defaultRoute, router);
}

authRoutes(document.getElementById('app'), '/login', {
  '/login': Login
});