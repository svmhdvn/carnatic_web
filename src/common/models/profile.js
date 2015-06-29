var API = require('../services/api_service.js');

var Profile = function(data) {
  var p = this;

  p.id = m.prop(data.id || 0);
  p.user_id = m.prop(data.user_id || 0);
  p.name = m.prop(data.name || '');

  p.picture_url = m.prop(data.picture_url || '');
  p.getSizedPicture = function(size) {
    return p.picture_url() + "&s=" + size;
  }
  
  p.created_at = m.prop(data.created_at || '');
};

module.exports = Profile;