requirejs.config({
  baseUrl: "js",
  paths: {
    "ui": "ui",
    "jquery": "jq",
  }
});

var session, desktopScreen, iconTheme;
requirejs(["jquery", "moment.min"], function($) {
  $(document).ready(function() {
    requirejs([
      "ui", 
      "manokwari/session", 
      "manokwari/screen",
      "manokwari/xdg-menu",
      "manokwari/icon-theme",
    ], function(ui, session) {
      session = new Session();
      desktopScreen = new Screen();
      iconTheme = new IconTheme(); // global
      xdgMenu = new XdgMenu("applications.menu");
      ui.initialize();
      ui.updateMenu();
    });
  })
});
