requirejs(["js/jq.js", 
    "moment.min", 
    "ui",
    "manokwari/desktop",
    ], function(jq, m, ui, desktop) {
  $(document).ready(function() {
    ui.initialize();
  });
});

