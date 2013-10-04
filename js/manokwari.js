requirejs.config({
  baseUrl: "js",
  paths: {
    "ui": "ui",
    "jquery": "jq",
  }
});

requirejs(["jquery", "moment.min"], function($) {
  requirejs(["ui", "manokwari/session"], function(ui, session) {
    $(document).ready(function() {
      ui.initialize();
      var s = new Session();

    });
  })
});
