// Mixer object
// Gets and sets master volume and mute state
// Provides "volume-changed" and "mute-changed" events
Mixer = function() {
  Gvc = imports.gi.Gvc;
  
  var self = this;
  // Init values
  self.sink = null;
  self.lastVolume = -1;
  self.lastMute = undefined;

  self.m = new Gvc.MixerControl({name: "manokwari-mixer"});
  self.m.signal.default_sink_changed.connect(function() {
    var s = self.m.get_default_sink();
    self.sink = s;
    s.signal.notify.connect(function(m) {
      if (self.lastMute != m.is_muted) {
        self.trigger("mute-changed");
        self.lastMute = m.is_muted;
      }
      if (self.lastVolume != m.volume) {
        self.trigger("volume-changed");
        self.lastVolume = m.volume;
      }
    });
  });
  self.m.open();
}

Mixer.prototype = new ManokwariObject(); 

// Sets or gets mute state
// Returns current mute state, true if it is muted
Mixer.prototype.mute = function(arg) {
  if (typeof(arg) === "undefined") {
    if (this.sink) {
      return this.sink.is_muted;
    } else {
      return -1;
    }
  } else {
    if (this.sink) {
      this.sink.change_is_muted(arg);
      return this.sink.is_muted;
    } else {
      return -1;
    }
  }
}

// Sets or gets volume
// Returns current volume (0-64K);
Mixer.prototype.volume = function(arg) {
  var self = this;
  if (typeof(arg) === "undefined") {
    if (this.sink) {
      return this.sink.volume;
    } else {
      return -1;
    }
  } else {
    if (this.sink) {
      this.sink.set_volume(arg);
      this.sink.push_volume();
      return this.sink.volume;
    } else {
      return -1;
    }
  }
}
