IconTheme = function() {
  if (iconTheme) {
    return;
  }
  Gtk = imports.gi.Gtk;
  this.update();
}

IconTheme.prototype.update = function() {
  this.theme = Gtk.IconTheme.get_default();
}

IconTheme.prototype.getPath = function(name) {
  var icon = this.theme.lookup_icon(name, 32, 0);
  if (icon && icon.get_filename) {
    return icon.get_filename();
  } else {
    return name;
  }
}
