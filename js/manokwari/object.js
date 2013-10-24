// Base manokwari object
// It provides object with event system
ManokwariObject = function() {
  this.events = {}; // Holds custom events
}

ManokwariObject.prototype.on = function(e, f) {
  this.events[e] = this.events[e] || []; // Gets current event list or re-init
  this.events[e].push(f);
}

ManokwariObject.prototype.trigger = function(e, p, q) {
  if (this.events[e] && this.events[e].length > 0) {
    for (var i = 0; i < this.events[e].length; i ++) {
      this.events[e][i](p, q);
    }
  }
}
