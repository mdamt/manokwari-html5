requirejs(["js/jq.js", 
    "moment.min", 
    "ui",
    "manokwari/session",
    ], function(jq, m, ui, d) {
  $(document).ready(function() {
    ui.initialize();
    var session = new Session();
  });
});

