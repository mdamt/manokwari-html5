Screen = function() {
  Wnck = imports.gi.Wnck;
  this.screen = Wnck.Screen.get_default(); 
  this.windows = {};
}

Screen.prototype.connectWindowList = function(f) {
  this.screen.signal.window_opened.connect(f);
  this.screen.signal.window_closed.connect(f);
}

// Returns the window list
Screen.prototype.windowList = function() {
  GdkPixbuf = imports.gi.GdkPixbuf;

  var r = [];
  var w = this.screen.get_windows();
  this.windows = {};
  if (w && w.length > 0) {
    for (var i = 0; i < w.length; i ++) {
      var icon = w[i].get_mini_icon();
      var buffer = {
        buffer: [],
        buffer_size: 1024,
      };
      icon.save_to_bufferv(buffer, 2048, "png", [],[]);
      var data = Base64.encodeBinary(buffer.buffer);
      var app = w[i].get_application();
      r.push({
        id: w[i].get_xid(),
        appName: w[i].get_name(),
        iconName: app.get_icon_name(),
        data: data,
      })
      this.windows["" + w[i].get_xid()] = w[i];
    }
  }
  return r;
}

Screen.prototype.activate = function(id) {
  var w = this.windows[""+id];
  if (w) {
    w.activate(0);
  }
}
