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