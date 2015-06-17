var Korvai = function(data) {
  this.id = m.prop(data.id || 0);
  this.user_id = m.prop(data.user_id || 0);
  this.content = m.prop(data.content || '');
  this.thalam = m.prop(data.thalam || 32);
  this.matras_after = m.prop(data.matrasAfter || 0);
  this.created_at = m.prop(data.created_at || '');
};

module.exports = Korvai;