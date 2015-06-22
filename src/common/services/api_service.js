// requires method (e.g. GET, POST, etc.)
// requires url (e.g. '/users/1')
// optional data (javascript object)
// optional auth_token (if authentication is required)
var API = function(method, url, data, auth_token) {
  var xhrConfig = function(xhr) {
    if(auth_token) xhr.setRequestHeader('Authorization', 'Token ' + auth_token);
  };

  return m.request({
    method: method,
    url: 'http://localhost:3000' + url,
    data: data || {},
    config: xhrConfig
  });
};

module.exports = API;