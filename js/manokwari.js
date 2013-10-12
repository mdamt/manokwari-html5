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
    requirejs(["ui", "manokwari/session", "manokwari/screen"], function(ui, session) {
      session = new Session();
      desktopScreen = new Screen();
      ui.initialize();

    });
  })
});
