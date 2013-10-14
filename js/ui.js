// BaseObject
// It is the base object derived by other objects below it
BaseObject = function() {
  this.element = $("");
}

BaseObject.prototype = {
  // Onclick handler
  click: function(cb) {
    // Just call the click method from jQuery
    this.element.click(cb);
  }
}

// Launcher menu object second level
// it is the applications menu 
// invoked by the LauncherMenu 
LauncherMenuSecondLevel = function() {
  this.element = $("#menu-second-level");
}

LauncherMenuSecondLevel.prototype = new BaseObject();

// Hides the menu
LauncherMenuSecondLevel.prototype.hide = function() {
  // Hiding means applying the menu-invisible class to the menu element
  this.element.addClass("menu-second-level-invisible");
}
// Shows the menu
LauncherMenuSecondLevel.prototype.show = function() {
  //  Showing means removing the menu-invisible class from the element
  this.element.removeClass("menu-second-level-invisible");
}
// Checks whether the menu is currently open or not
LauncherMenuSecondLevel.prototype.isOpen = function() {
  // The menu is open when it does not have the menu-invisible class
  return !this.element.hasClass("menu-second-level-invisible");
}
// Tries to hide the menu if it is open
LauncherMenuSecondLevel.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hideMenu();
  }
}

// Launcher menu object
// it is the launcher menu on the left of the screen
// invoked by the "launcher" button
LauncherMenu = function() {
  this.element = $("#menu");
  this.secondLevel = new LauncherMenuSecondLevel();
  this.applicationEntryTemplate = $(".application-entry.template");
  this.applicationListTemplate = $(".application-list.template");
  this.applicationMenuContainer = $("#applications");
  this.applicationCategoryTemplate = $(".application-category.template");
  this.applicationSecondLevelContainer = $("#menu-second-level");
  this.applicationContainer = {};
}

LauncherMenu.prototype = new BaseObject();

// Hides the menu
LauncherMenu.prototype.hideMenu = function() {
  // Hiding means applying the menu-invisible class to the menu element
  this.element.addClass("menu-invisible");
  this.secondLevel.hide();
}
// Shows the menu
LauncherMenu.prototype.showMenu = function() {
  //  Showing means removing the menu-invisible class from the element
  this.element.removeClass("menu-invisible");
  this.secondLevel.show();
}
// Checks whether the menu is currently open or not
LauncherMenu.prototype.isOpen = function() {
  // The menu is open when it does not have the menu-invisible class
  return !this.element.hasClass("menu-invisible");
}
// Tries to hide the menu if it is open
LauncherMenu.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hideMenu();
  }
}

// Updates application menu
LauncherMenu.prototype.updateApplicationMenu = function() {
  var self = this;
  this.applicationMenuContainer.children(":not(.template").remove();
  this.applicationSecondLevelContainer.children(":not(.template)").remove();

  // xdgMenu is initialized in js/manokwari.js
  // Now we prepare the directory
  xdgMenu.on("directory", function(data) {
    if (data.name == "+root+") {
      return; // don't process root
    }
    var template = self.applicationCategoryTemplate;
    var entry = template.clone();
    entry.removeClass("template");
    entry.attr("data-id", data.id);
    entry.find(".application-category-name").text(data.name);
    self.applicationMenuContainer.append(entry);
    entry.click(function() {
      var id = $(this).attr("data-id");
      $(".application-list").addClass("application-list-invisible");
      var appList = $("#applications" + id);
      appList.removeClass("application-list-invisible");
      var pos = appList.position();
      self.applicationSecondLevelContainer.scrollTop(pos.top);
    });
  });
  // Now we append each entry to each category
  xdgMenu.on("entry", function(data) {
    var template = self.applicationEntryTemplate;
    var container;
    // Query the element not from DOM but instead from a has
    // for performance reason
    if (self.applicationContainer[data.parent]) {
      container = self.applicationContainer[data.parent];
    } else {
      // Create new container if not exists
      var c = self.applicationListTemplate;
      var container = c.clone();
      container.removeClass("template");
      container.attr("id", "applications" + data.parent);
      self.applicationContainer[data.parent] = container;
      self.applicationSecondLevelContainer.append(container);
    }

    var entry = template.clone();
    entry.removeClass("template");
    entry.find(".application-entry-title").text(data.name);
    container.append(entry);
  });

  xdgMenu.update(); 
}

// DesktopArea object
// It is the big desktop area filling up the screen
DesktopArea = function() {
  this.element = $("#desktop");
}

DesktopArea.prototype = new BaseObject();

// LauncherButton object
// It is the small button on the top left of the screen
LauncherButton = function() {
  this.element = $("#launcher");
}

LauncherButton.prototype = new BaseObject();

// LaunchedApps object
// It is the long bar on the top left most of the screen,
// It contains the icons of the currently running applications
LaunchedApps = function () {
  this.element = $("#launched-apps");
  this.icons = new LaunchedAppIcons();

  // connect the window list update
  // defer the update 
  var self = this;
  setTimeout(function() {
    self.updateIconList();
    desktopScreen.connectWindowList(function() {
      self.updateIconList();
    });
  }, 1000);
}

LaunchedApps.prototype = new BaseObject();

// Gets a new list of windows and update the icon list
// accordingly
LaunchedApps.prototype.updateIconList = function() {
  var self = this;

  // icon list
  var container = $(".launched-apps-icon-list");
  var template = container.find(".template");
  var list = desktopScreen.windowList();
  container.children(":not(.template)").remove();
  for (var i = 0; i < list.length; i ++) {
    var entry = template.clone();
    entry.attr("data-id", list[i].id);
    entry.removeClass("template");
    container.append(entry);
    entry.click(function() {
      desktopScreen.activate($(this).attr("data-id"));
    });
  }
  $(".launched-apps-icon-list-entry").mouseenter(function() {
    self.icons.show($(this).attr("data-id"));
  });

  // icon and window list
  var container = $("#launched-app-icons-container");
  var template = container.find(".template");
  container.children(":not(.template)").remove();
  for (var i = 0; i < list.length; i ++) {
    var entry = template.clone();
    entry.attr("id", "window" + list[i].id);
    entry.removeClass("template");
    entry.find(".launched-app-entry-text").text(list[i].appName);
    container.append(entry);
    entry.mouseenter(function() {
      self.icons.tryHide();
    });
  }
}

// TrayArea object
// It is the long bar on the top right most of the screen
// It contains placeholder for applications tray icons
TrayArea = function() {
  this.element = $("#tray");
}

TrayArea.prototype = new BaseObject();

// DesktopMenuButton object
// It is the button on the top rigt of the screen
// It is for displaying the desktop menu
DesktopMenuButton = function() {
  this.element = $("#desktop-button");
}

DesktopMenuButton.prototype = new BaseObject();

// DesktopMenu object
// It is the menu on the right of the screen
// It contains favorites and workspace selector
// invoked by the "desktop-button" button
DesktopMenu = function() {
  this.element = $("#desktop-menu");
}

DesktopMenu.prototype = new BaseObject();

// Hides the menu
DesktopMenu.prototype.hideMenu = function() {
  // Hiding means applying the menu-invisible class to the menu element
  this.element.addClass("desktop-menu-invisible");
}
// Shows the menu
DesktopMenu.prototype.showMenu = function() {
  //  Showing means removing the menu-invisible class from the element
  this.element.removeClass("desktop-menu-invisible");
}
// Checks whether the menu is currently open or not
DesktopMenu.prototype.isOpen = function() {
  // The menu is open when it does not have the menu-invisible class
  return !this.element.hasClass("desktop-menu-invisible");
}
// Tries to hide the menu if it is open
DesktopMenu.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hideMenu();
  }
}

// Dimmer object
// It is the big object covering everything but underneath the menus
Dimmer = function() {
  this.element = $("#dimmer");
}

Dimmer.prototype = new BaseObject();

// Hides the menu
Dimmer.prototype.hide = function() {
  var self = this;
  // Hiding means applying the dimmer-out and eventually removing the dimmer-fade from the menu element
  self.element.off("webkitTransitionEnd");
  // Do the removal after the animation ends
  self.element.on("webkitTransitionEnd", function(event) {
    self.element.removeClass("dimmer-fade");
    // Hide the element
    self.element.css("display", "none");
    // Detach the event handler
    self.element.off("webkitTransitionEnd");
  });
  // Start the animation
  self.element.addClass("dimmer-out");
}
// Shows the menu
Dimmer.prototype.show = function() {
  var self = this;
  // show the element first
  self.element.css("display", "inherit");
  //  Showing means removing the dimmer-out and  adding dimmer-fade class from the element
  setTimeout(function() {
    self.element.removeClass("dimmer-out");
    self.element.addClass("dimmer-fade");
  }, 0); // invoke with setTimeout to get the element shown first
}
// Checks whether the dimmer is currently open or not
Dimmer.prototype.isOpen = function() {
  // The dimmer is open when it does not have the dimmer-out class
  return !this.element.hasClass("dimmer-out");
}
// Tries to hide the menu if it is open
Dimmer.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hide();
  }
}

// LogoutScreen object
// It is the big object covering everything  
LogoutScreen = function() {
  this.element = $("#log-out-screen-area");
}

LogoutScreen.prototype = new BaseObject();

// Hides the logout screen 
LogoutScreen.prototype.hide = function() {
  var self = this;
  // Hiding means applying the logout-screen-out and eventually removing the logout-screen-fade from the menu element
  self.element.off("webkitTransitionEnd");
  // Do the removal after the animation ends
  self.element.on("webkitTransitionEnd", function(event) {
    self.element.removeClass("logout-screen-fade");
    // Hide the element
    self.element.css("display", "none");
    // Detach the event handler
    self.element.off("webkitTransitionEnd");
  });
  // Start the animation
  self.element.addClass("log-out-screen-out");
}
// Shows the menu
LogoutScreen.prototype.show = function() {
  var self = this;
  // show the element first
  self.element.css("display", "inherit");
  //  Showing means removing the logout-screen-out and  adding logout-screen-fade class from the element
  setTimeout(function() {
    self.element.removeClass("log-out-screen-out");
    self.element.addClass("log-out-screen-fade");
  }, 0); // invoke with setTimeout to get the element shown first
}
// Checks whether the logout-screen is currently open or not
LogoutScreen.prototype.isOpen = function() {
  // The logout-screen is open when it does not have the logout-screen-out class
  return !this.element.hasClass("log-out-screen-out");
}
// Tries to hide the menu if it is open
LogoutScreen.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hide();
  }
}

// LockScreen object
// It is the big object covering everything  
LockScreen = function() {
  this.element = $("#lock-screen-area");
}

LockScreen.prototype = new BaseObject();

// Hides the lock screen 
LockScreen.prototype.hide = function() {
  var self = this;
  // Hiding means applying the lock-screen-out and eventually removing the lock-screen-fade from the menu element
  self.element.off("webkitTransitionEnd");
  // Do the removal after the animation ends
  self.element.on("webkitTransitionEnd", function(event) {
    self.element.removeClass("lock-screen-fade");
    // Hide the element
    self.element.css("display", "none");
    // Detach the event handler
    self.element.off("webkitTransitionEnd");
  });
  // Start the animation
  self.element.addClass("lock-screen-out");
}
// Shows the menu
LockScreen.prototype.show = function() {
  var self = this;
  // show the element first
  self.element.css("display", "inherit");
  //  Showing means removing the lock-screen-out and  adding lock-screen-fade class from the element
  setTimeout(function() {
    self.element.removeClass("lock-screen-out");
    self.element.addClass("lock-screen-fade");
  }, 0); // invoke with setTimeout to get the element shown first
}
// Checks whether the lock-screen is currently open or not
LockScreen.prototype.isOpen = function() {
  // The lock-screen is open when it does not have the lock-screen-out class
  return !this.element.hasClass("lock-screen-out");
}
// Tries to hide the menu if it is open
LockScreen.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hide();
  }
}

// AppletsArea object
// This is the applets area object on top of the screen
AppletsArea = function() {
  this.element = $("#panel-applets");

  // Get the reference of panel-applets-invisible style from the css
  // Because we want to modify the transition3d according to the height of the area
  for (var i = 0; i < document.styleSheets.length; i++) {
    // Get the sheet 
    var sheet = document.styleSheets[i];
    if (sheet.rules) {
      // If there are rules in the sheet, find the .panel-applets-invisible rules
      for (var j = 0; j < sheet.rules.length; j ++) {
        if (sheet.rules[j].selectorText == ".panel-applets-invisible") {
          // Keep the reference in the this.rules
          this.rules = sheet.rules[j];
        }
      }
    }
  }
}

AppletsArea.prototype = new BaseObject();
AppletsArea.prototype.updateHeight = function() {
  // Adjust top coordinate according to the height of the panel
  var panelHeight = $("#panel").height();
  this.element.css("top", panelHeight + "px");

  // Adjust element's translate3d according to the element's height
  var myHeight = this.element.height();
  // Modify the style pointed by this.rules we got in the constructor above
  this.rules.style.webkitTransform = "translate3d(0, -" + myHeight + "px, 0)";
}

// Removing the -invisible class will show the element
AppletsArea.prototype.show = function() {
  this.updateHeight();
  this.element.removeClass("panel-applets-invisible");
}
// Adding the -invisible class will hide the element
AppletsArea.prototype.hide = function() {
  this.updateHeight();
  this.element.addClass("panel-applets-invisible");
}
// Checks whether the area is currently open or not
AppletsArea.prototype.isOpen = function() {
  // The area is open when it does not have the -invisible class
  return !this.element.hasClass("panel-applets-invisible");
}
// Tries to hide the area if it is open
AppletsArea.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the area when it is open
    this.hide();
  }
}

// LaunchedAppIcons object
// This is the applets area object on top of the screen
LaunchedAppIcons = function() {
  this.element = $("#launched-app-icons");

  // Get the reference of launched-app-icons-invisible style from the css
  // Because we want to modify the transition3d according to the height of the area
  for (var i = 0; i < document.styleSheets.length; i++) {
    // Get the sheet 
    var sheet = document.styleSheets[i];
    if (sheet.rules) {
      // If there are rules in the sheet, find the .launched-app-icons-invisible rules
      for (var j = 0; j < sheet.rules.length; j ++) {
        if (sheet.rules[j].selectorText == ".launched-app-icons-invisible") {
          // Keep the reference in the this.rules
          this.rules = sheet.rules[j];
        }
      }
    }
  }
}

LaunchedAppIcons.prototype = new BaseObject();
LaunchedAppIcons.prototype.updateHeight = function() {
  // Adjust top coordinate according to the height of the panel
  var panelHeight = $("#panel").height();
  this.element.css("top", panelHeight + "px");

  // Adjust element's translate3d according to the element's height
  var myHeight = this.element.height();
  // Modify the style pointed by this.rules we got in the constructor above
  this.rules.style.webkitTransform = "translate3d(0, -" + myHeight + "px, 0)";
}

// Removing the -invisible class will show the element
LaunchedAppIcons.prototype.show = function(id) {
  this.updateHeight();
  this.element.removeClass("launched-app-icons-invisible");
  $(".launched-app-entry-highlighted").removeClass("launched-app-entry-highlighted");
  var highlight = $("#window" + id);
  highlight.addClass("launched-app-entry-highlighted");
  var top = highlight.position().top;
  $("#launched-app-icons").scrollTop(top);
  $("body").trigger("launched-app-icons-shown");
}
// Adding the -invisible class will hide the 
LaunchedAppIcons.prototype.hide = function() {
  this.updateHeight();
  this.element.addClass("launched-app-icons-invisible");
}
// Checks whether the area is currently open or not
LaunchedAppIcons.prototype.isOpen = function() {
  // The area is open when it does not have the -invisible class
  return !this.element.hasClass("launched-app-icons-invisible");
}
// Tries to hide the area if it is open
LaunchedAppIcons.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the area when it is open
    this.hide();
    $("body").trigger("launched-app-icons-hidden");
  }
}

// NotificationArea object
// This is the clock object on the right bottom of the screen
NotificationArea = function() {
  this.element = $("#notification-area");

  // Get the reference of notification-area-invisible style from the css
  // Because we want to modify the transition3d according to the height of the area
  for (var i = 0; i < document.styleSheets.length; i++) {
    // Get the sheet 
    var sheet = document.styleSheets[i];
    if (sheet.rules) {
      // If there are rules in the sheet, find the .notification-area-invisible rules
      for (var j = 0; j < sheet.rules.length; j ++) {
        if (sheet.rules[j].selectorText == ".notification-area-invisible") {
          // Keep the reference in the this.rules
          this.rules = sheet.rules[j];
        }
      }
    }
  }
}

NotificationArea.prototype = new BaseObject();
NotificationArea.prototype.updateHeight = function() {
  // Adjust element's translate3d according to the element's height
  var myHeight = this.element.height();
  // Modify the style pointed by this.rules we got in the constructor above
  if (this.rules && this.rules.style) {
    this.rules.style.webkitTransform = "translate3d(0, " + myHeight + "px, 0)";
  }
}

// Removing the -invisible class will show the element
NotificationArea.prototype.show = function() {
  this.updateHeight();
  this.element.removeClass("notification-area-invisible");
}
// Adding the -invisible class will hide the element
NotificationArea.prototype.hide = function() {
  this.updateHeight();
  this.element.addClass("notification-area-invisible");
}
// Checks whether the area is currently open or not
NotificationArea.prototype.isOpen = function() {
  // The area is open when it does not have the -invisible class
  return !this.element.hasClass("notification-area-invisible");
}

// Tries to hide the area if it is open
NotificationArea.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the area when it is open
    this.hide();
  }
}


// Clock object
// This is the clock object on the right bottom of the screen
Clock = function() {
  this.element = $("#clock");
  this.update();
}

Clock.prototype = new BaseObject();

Clock.prototype.update = function() {
  var self = this;
  var now = new Date();

  // TODO: i18n
  $("#clock-time").text(moment(now).format("HH:mm"));
  $("#clock-date").text(moment(now).format("dddd, DD MMMM YYYY"));
  setTimeout(function() {
    self.update();
  }, 1000);
}

// The actual instances
var launcherMenu, 
    desktopArea, 
    launcherButton, 
    launchedApps,
    trayArea,
    desktopMenu,
    dimmer,
    appletsArea,
    logoutScreen,
    lockScreen,
    notificationArea,
    clock;

// Setup events
var setupEvents = function() {
  // Shows menu when the launcherButton is clicked
  launcherButton.click(function() {
    launcherMenu.showMenu();
    dimmer.show();
    // try to hide the desktop menu
    desktopMenu.tryHide()
    appletsArea.tryHide();
    launchedApps.icons.tryHide();
  });

  dimmer.click(function() {
    launcherMenu.tryHide()
    desktopMenu.tryHide()
    appletsArea.tryHide();
    launchedApps.icons.tryHide();
    dimmer.tryHide();
  });

  // Shows menu when the launcherButton is clicked
  desktopMenuButton.click(function() {
    desktopMenu.showMenu();
    // try to hide the launcher menu
    launcherMenu.tryHide()
    appletsArea.tryHide();
    launchedApps.icons.tryHide();
    dimmer.show();
  });

  $("body").on("launched-app-icons-shown", function() {
    appletsArea.tryHide();
    launcherMenu.tryHide()
  });
  trayArea.click(function() {
    // Hide if it is open, otherwise just open
    if (appletsArea.isOpen()) {
      appletsArea.tryHide();
    } else {
      appletsArea.show();
    }
    launchedApps.icons.tryHide();
  });

  desktopArea.click(function() {
    appletsArea.tryHide();
    launchedApps.icons.tryHide();
  });

  $("#session-log-out").click(function() {
    logoutScreen.show();
  });

  $("#log-out-cancel").click(function() {
    logoutScreen.tryHide();
  });

  $("#lock-screen").click(function() {
    lockScreen.show();
  });

  $("#unlock-screen").click(function() {
    lockScreen.tryHide();
  });

  $("#dismiss-notification-area").click(function() {
    notificationArea.tryHide();
  });

  // Test notifcation area
  setTimeout(function() {
    notificationArea.show();
  }, 5000)
  // Add timeout here as well
  $("#dismiss-notification-area").click(function() {
    setTimeout(function() {
      notificationArea.show();
    }, 5000)
  });
}

var initializeUi = function() {
  launcherMenu = new LauncherMenu();
  desktopArea = new DesktopArea();
  launcherButton = new LauncherButton();
  launchedApps = new LaunchedApps();
  desktopMenu = new DesktopMenu();
  trayArea = new TrayArea();
  desktopMenuButton = new DesktopMenuButton();
  dimmer = new Dimmer();
  lockScreen = new LockScreen();
  logoutScreen = new LogoutScreen();
  appletsArea = new AppletsArea();
  notificationArea = new NotificationArea();
  clock = new Clock();

  setupEvents();
}

define(function() {
  return {
    initialize: initializeUi,
    updateMenu: function() {
      launcherMenu.updateApplicationMenu();
    }
  }
});
