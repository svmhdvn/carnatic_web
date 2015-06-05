var Korvai = function(data) {
  this.content = m.prop(data.content || '');
  this.thalam = m.prop(data.thalam || 32);
  this.matrasAfter = m.prop(data.matrasAfter || 0);
};