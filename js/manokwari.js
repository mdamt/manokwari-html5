requirejs.config({
  baseUrl: "js",
  paths: {
    "ui": "ui",
    "jquery": "jq",
  }
});

var session, desktopScreen;
requirejs(["jquery", "moment.min"], function($) {
  $(document).ready(function() {
    requirejs([
      "ui", 
      "manokwari/session", 
      "manokwari/screen",
      "manokwari/xdg-menu",
    ], function(ui, session) {
      session = new Session();
      desktopScreen = new Screen();
      xdgMenu = new XdgMenu("applications.menu");
      ui.initialize();
      ui.updateMenu();
    });
  })
});
