Session = function() {
  this.update();
}

Session.prototype.canShutdown = function() {
  // TODO
  return true;
}

Session.prototype.canLogout = function() {
  // TODO
  return true;
}

Session.prototype.update = function() {
  if (this.canShutdown) {
    $("#session-shut-down").removeClass("hidden");
  } else {
    $("#session-shut-down").addClass("hidden");
  }

  if (this.canLogout) {
    $("#session-log-out").removeClass("hidden");
  } else {
    $("#session-log-out").addClass("hidden");
  }

}
