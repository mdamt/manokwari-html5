// Power object

Power = function() {
  UPowerGlib = imports.gi.UPowerGlib;
  var self = this;
  this.devices = {};
  this.readySent = false;

  self.u = new UPowerGlib.Client();
  self.u.signal.changed.connect(function(c, d) {
    self.updateDevices();
  });

  self.u.signal.device_added.connect(function(c, d) {
    var path = d.get_object_path();
    var initialDev = {
      path: path,
      device: d,
      state: "",
      percentage: NaN,
      time_to_empty: NaN,
      time_to_full: NaN,
      full: undefined,
    }
    self.devices[path] = initialDev;

    d.signal.changed.connect(function(dc) {
      var dev = self.getDevice(dc);
      if (dev != null) {
        var state = UPowerGlib.Device.state_to_string(dev.device.state);
        if (self.devices[dev.path] && 
          state != self.devices[dev.path].state) {
          self.devices[dev.path].state = state;
          self.trigger("state", {
            state: state,
            path: path,
          });
        }

        var percentage = dev.device.percentage;
        if (self.devices[dev.path] && 
          percentage != self.devices[dev.path].percentage) {
          self.devices[dev.path].percentage = percentage;
          self.trigger("percentage", {
            percentage: percentage,
            path: path,
          });
        }

        var time_to_empty = dev.device.time_to_empty;
        if (self.devices[dev.path] && 
          time_to_empty != self.devices[dev.path].time_to_empty) {
          self.devices[dev.path].time_to_empty = time_to_empty;
          self.trigger("time-to-empty", {
            time_to_empty: time_to_empty,
            path: path,
          });
        }

        var time_to_full = dev.device.time_to_full;
        if (self.devices[dev.path] && 
          time_to_full != self.devices[dev.path].time_to_full) {
          self.devices[dev.path].time_to_full = time_to_full;
          self.trigger("time-to-full", {
            time_to_full: time_to_full,
            path: path,
          });
        }
      }
      if (self.readySent == false) {
        self.readySent = true;
        self.trigger("ready");
      }
    });
  });

  self.updateDevices();
}

Power.prototype = new ManokwariObject();

Power.prototype.updateDevices = function() {
  if (this.u.enumerate_devices_sync()) {
  }
}

Power.prototype.getDevice = function(dc) {
  var path = dc.get_object_path();
  var ret = null;
  if (path) {
    ret = this.devices[path];
  }

  return ret;
}
