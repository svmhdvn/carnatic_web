var API = require('../services/api_service.js');

var Profile = function(data) {
  this.id = m.prop(data.id || 0);
  this.user_id = m.prop(data.user_id || 0);
  this.name = m.prop(data.name || '');
  this.picture_url = m.prop(data.picture_url || '');
  this.created_at = m.prop(data.created_at || '');
};

module.exports = Profile;