var LoginPage = require('./Static/login.js');
var RegisterPage = require('./Static/register.js');

m.route.mode = 'hash';
m.route(document.getElementById('StaticContainer'), '/login', {
  '/login': LoginPage,
  '/register': RegisterPage
});