var Header = {};

Header.controller = function() {
  this.uid = CurrentUser.uid();
};

Header.view = function(ctrl) {
  return (
    {tag: "nav", attrs: {class:"navbar navbar-inverse navbar-fixed-top", id:"Header"}, children: [
      {tag: "div", attrs: {class:"container-fluid"}, children: [
        {tag: "div", attrs: {class:"navbar-header"}, children: [
          {tag: "button", attrs: {type:"button", class:"navbar-toggle collapsed", "data-toggle":"collapse", "data-target":"#navbar", "aria-expanded":"false", "aria-controls":"navbar"}, children: [
            {tag: "span", attrs: {class:"sr-only"}, children: ["Toggle navigation"]}, 
            {tag: "span", attrs: {class:"icon-bar"}}, 
            {tag: "span", attrs: {class:"icon-bar"}}, 
            {tag: "span", attrs: {class:"icon-bar"}}
          ]}, 
          {tag: "a", attrs: {class:"navbar-brand", href:"#"}, children: ["Carnatic"]}
        ]}, 
        {tag: "div", attrs: {id:"navbar", class:"navbar-collapse collapse"}, children: [
          {tag: "ul", attrs: {class:"nav navbar-nav navbar-right"}, children: [
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: ["Dashboard"]}]}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: ["Settings"]}]}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: ["Profile"]}]}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: ["Help"]}]}, 
            {tag: "li", attrs: {class:"divider"}}, 
            {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [ctrl.uid]}]}
          ]}
        ]}
      ]}
    ]}
  );
};

var AppLayout = function(view) {
  return function(ctrl) {
    return (
      {tag: "div", attrs: {id:"AppLayout"}, children: [
        Header, 
        {tag: "div", attrs: {class:"container-fluid"}, children: [
          view(ctrl)
        ]}
      ]}
    );
  };
};
var CurrentUser = (function(){
  var localUserData = JSON.parse(localStorage.getItem('carnatic-currentUser')) || {};

  return {
    uid: m.prop(localUserData.uid || ''),
    email: m.prop(localUserData.email || '')
  };
}());

CurrentUser.reset = function(userData) {
  CurrentUser.uid(userData.uid);
  CurrentUser.email(userData.email);
  localStorage.setItem('carnatic-currentUser', JSON.stringify(userData));
};

var AuthService = {
  login: function(email, password) {
    var ref = new Firebase("https://carnatic.firebaseio.com/");
    var deferred = m.deferred();
    m.startComputation();

    ref.authWithPassword({
      email: email,
      password: password
    }, function(error, authData) {
      if(error) {
        console.log("Firebase login failed, error: ", error);
        deferred.reject(error);
        m.endComputation();
      } else {
        console.log("Firebase login successful, authData: ", authData);
        var userData = {
          uid: authData.uid,
          email: authData.password.email
        }
        CurrentUser.reset(userData);
        deferred.resolve(userData);
        m.endComputation();
      }
    });

    return deferred.promise;
  }
}
var Korvai = function(data) {
  this.content = m.prop(data.content || '');
  this.thalam = m.prop(data.thalam || 32);
  this.matrasAfter = m.prop(data.matrasAfter || 0);
};
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
      {tag: "div", attrs: {class:"panel panel-primary"}, children: [
        {tag: "div", attrs: {class:"panel-heading"}, children: [
          {tag: "h3", attrs: {class:"panel-title"}, children: [title]}
        ]}, 
        {tag: "div", attrs: {class:"panel-body"}, children: [
          korvai.content()
        ]}
      ]}
    );
  });

  return (
    {tag: "div", attrs: {id:"ProfileKorvais"}, children: [
      {tag: "h1", attrs: {}, children: ["Korvais View"]}, {tag: "br", attrs: {}}, 
      korvais
    ]}
  );
});
function authRoutes(root, defaultRoute, router) {
  for(var route in router) {
    var module = router[route];

    router[route] = {
      view: module.view,
      controller: module.skipAuth ? module.controller : function authController() {
        if(CurrentUser.uid()) success();
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
  '/login': Login,
  '/korvais': ProfileKorvais
});