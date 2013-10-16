XdgMenu = function(catalog) {
  this.catalog = catalog;
  GMenu = imports.gi.GMenu;
  this.events = {}; // Holds custom events

}

XdgMenu.prototype.update = function() {
  var tree = new GMenu.Tree({menu_basename: this.catalog, flags: GMenu.TreeFlags.NONE}); 
  tree.load_sync();
  var root = tree.get_root_directory();
  this.trigger("directory", {
    parent: null,
    name: "+root+", 
    id: "+root+",
  });
  this.traverse(root, "+root+");
}

XdgMenu.prototype.traverse = function(root, parent) {
  var iter = root.iter();
  while(1) {
    var result = iter.next();
    if (result == GMenu.TreeItemType.INVALID) {
      break;
    }
    else if (result == GMenu.TreeItemType.DIRECTORY) {
      var dir = iter.get_directory();
      var name = this.processDirectory(dir);
      this.traverse(dir, name);
    }
    else if (result == GMenu.TreeItemType.ENTRY) {
      this.processEntry(iter.get_entry(), parent);
    }
  }
}

XdgMenu.prototype.processEntry = function(entry, parent) {
  var appInfo = entry.get_app_info();
  var icon = iconTheme.getPath(appInfo.get_icon().to_string());
  this.trigger("entry", {
    name: appInfo.get_display_name(), 
    parent: parent,
    icon: icon,
  }); 
}

XdgMenu.prototype.processDirectory = function(dir) {
  var id = dir.get_menu_id().replace(" ", "");;
  this.trigger("directory", {
    name: dir.get_name(), 
    parent: parent,
    id: id
  }); 
  return id;
}

XdgMenu.prototype.on = function(e, f) {
  this.events[e] = this.events[e] || []; // Gets current event list or re-init
  this.events[e].push(f);
}

XdgMenu.prototype.trigger = function(e, p, q) {
  if (this.events[e].length > 0) {
    for (var i = 0; i < this.events[e].length; i ++) {
      this.events[e][i](p, q);
    }
  }
}
