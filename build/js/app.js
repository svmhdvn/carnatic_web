var Login = {
  skipAuth: true
};

Login.view = function() {
  return (
    {tag: "div", attrs: {id:"Login"}, children: [
      {tag: "div", attrs: {class:"container"}, children: [
        {tag: "form", attrs: {class:"form-signin"}, children: [
          {tag: "h2", attrs: {class:"form-signin-heading"}, children: ["Please sign in"]}, 

          {tag: "label", attrs: {for:"inputEmail", class:"sr-only"}, children: ["Email address"]}, 
          {tag: "input", attrs: {
            type:"email", 
            id:"inputEmail", 
            class:"form-control", 
            placeholder:"Email address", 
            required:true,autofocus:true}}, 

          {tag: "label", attrs: {for:"inputPassword", class:"sr-only"}, children: ["Password"]}, 
          {tag: "input", attrs: {
            type:"password", 
            id:"inputPassword", 
            class:"form-control", 
            placeholder:"Password", 
            required:true}}, 

          {tag: "div", attrs: {class:"checkbox"}, children: [
            {tag: "label", attrs: {}, children: [
              {tag: "input", attrs: {type:"checkbox", value:"remember-me"}}, " Remember me"
            ]}
          ]}, 

          {tag: "button", attrs: {class:"btn btn-lg btn-primary btn-block", type:"submit"}, children: ["Sign in"]}
        ]}
      ]}
    ]}
  );
};
var CurrentUser = {
  auth_token: m.prop(localStorage.getItem('carnatic-user-token') || '')
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